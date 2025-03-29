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

        const blob = await store.get(decodeURIComponent(blobId), { type: "blob" });
        console.log("Blob obtenido:", blob ? blob.type : "No se encontró blob");
        let contentType = blob.type;
        if (contentType === "binary/octet-stream") {
            const lowerBlobId = blobId.toLowerCase();
            if (lowerBlobId.endsWith('.png')) {
                contentType = 'image/png';
            } else if (
                lowerBlobId.endsWith('.jfif') ||
                lowerBlobId.endsWith('.jpg') ||
                lowerBlobId.endsWith('.jpeg')
            ) {
                contentType = 'image/jpeg';
            } else if (lowerBlobId.endsWith('.gif')) {
                contentType = 'image/gif';
            } // Puedes agregar más condiciones según tus necesidades
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