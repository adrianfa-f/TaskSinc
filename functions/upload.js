import { getStore } from "@netlify/blobs";
import { parse } from 'lambda-multipart-parser';

export const handler = async (event) => {
    try {
        // 1. Parsear el FormData correctamente
        const { files } = await parse(event);
        const file = files[0];
        
        // 2. Obtener parámetros
        const { userId, type } = event.queryStringParameters;
        
        // 3. Configurar almacenamiento
        const store = getStore({
            name: `${userId}-${type}`,
            siteID: process.env.NETLIFY_BLOBS_SITE_ID,
            token: process.env.NETLIFY_BLOBS_TOKEN,
            apiURL: "https://api.netlify.com/api/v1"
        });

        // 4. Guardar archivo
        const blobId = encodeURIComponent(`${Date.now()}-${file.filename}`);
        const mimeType = file.contentType === "binary/octet-stream" ? "image/jpeg" : file.contentType;
            await store.set(blobId, file.content, {
                metadata: { type: mimeType }
            });
            const blob = await store.get(decodeURIComponent(blobId), { type: "blob" });
            console.log("Blobs completo: ", blob)
        // 5. Responder URL pública
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
            publicUrl: `/.netlify/functions/get?userId=${userId}&type=${type}&blobId=${blobId}`
            })
        };
    } catch (error) {
        return { statusCode: 500, headers: { "Access-Control-Allow-Origin": "*" }, body: error.message };
    }
};