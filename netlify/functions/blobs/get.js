// netlify/functions/blobs/get.js
import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
    try {
        const { userId, type, blobId } = event.queryStringParameters;

        const store = getStore({
            name: `${userId}-${type}`,
            siteID: process.env.NETLIFY_BLOBS_SITE_ID,
            token: process.env.NETLIFY_BLOBS_TOKEN,
        });

        const blob = await store.get(blobId, { type: "blob" });

        if (!blob) {
            return { statusCode: 404, body: "Imagen no encontrada" };
        }

        return {
            statusCode: 200,
            headers: {
              "Content-Type": "image/*", // Tipo dinámico
              "Cache-Control": "public, max-age=31536000" // Cache 1 año
            },
            body: blob.toString("base64"),
            isBase64Encoded: true
        };
    } catch (error) {
        return { statusCode: 500, body: error.message };
    }
};