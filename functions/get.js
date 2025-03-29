import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
    try {
        console.log("inicio del get")
        const { userId, type, blobId } = event.queryStringParameters;
        console.log("Parámetros recibidos:", { userId, type, blobId });

        const store = getStore({
            name: `${userId}-${type}`,
            siteID: process.env.NETLIFY_BLOBS_SITE_ID,
            token: process.env.NETLIFY_BLOBS_TOKEN,
        });

        const decodedBlobId = decodeURIComponent(blobId);
        const blob = await store.get(decodedBlobId, { type: "blob" });
        console.log("Blob obtenido:", blob);
        let contentType = blob.type;
        if (contentType === "binary/octet-stream" || !contentType) {
            const extension = blobId.split('.').pop().toLowerCase();
            switch(extension) {
                case 'png': contentType = 'image/png'; break;
                case 'jpg': 
                case 'jpeg': contentType = 'image/jpeg'; break;
                case 'gif': contentType = 'image/gif'; break;
                default: contentType = 'application/octet-stream';
            }
        }

        return {
            statusCode: 200,
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "https://tasksinc.netlify.app"
            },
            body: blob.toString("base64"),
            isBase64Encoded: true
        };
    } catch (error) {
        console.error("Error en GET:", error);
        return { statusCode: 500, body: error.message };
    }
};