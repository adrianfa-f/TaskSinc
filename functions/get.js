import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
    try {
        const { userId, type, blobId } = event.queryStringParameters;
        console.log("Parámetros recibidos:", { userId, type, blobId });

        const store = getStore({
            name: `${userId}-${type}`,
            siteID: process.env.NETLIFY_BLOBS_SITE_ID,
            token: process.env.NETLIFY_BLOBS_TOKEN,
        });

        const blob = await store.get(blobId, { type: "blob" });
        console.log("Blob obtenido:", blob);
        if (!blob) {
            return { 
                statusCode: 404, 
                headers: { "Access-Control-Allow-Origin": "*" },
                body: "Archivo no encontrado" 
            };
        }

        const arrayBuffer = await blob.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        return {
            statusCode: 200,
            headers: {
                "Content-Type": blob.type,
                "Access-Control-Allow-Origin": "*"
            },
            body: base64Data,
            isBase64Encoded: true
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: error.message 
        };
    }
};