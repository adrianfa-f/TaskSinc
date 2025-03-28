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
        const blobId = `${Date.now()}-${file.filename}`;
            await store.set(blobId, file.content, {
                metadata: { type: file.contentType }
            });

        // 5. Responder URL pública
        return {
            statusCode: 200,
            body: JSON.stringify({
            publicUrl: `/.netlify/functions/blobs/get?userId=${userId}&type=${type}&blobId=${blobId}`
            })
        };
    } catch (error) {
        return { statusCode: 500, body: error.message };
    }
};