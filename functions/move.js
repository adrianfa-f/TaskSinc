// blobs/move.js
import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
    try {
        const { userId, oldType, newType, blobId, taskId } = JSON.parse(event.body);

        if (!userId || !oldType || !newType || !blobId || !taskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Parámetros incompletos", "userId": userId,"oldType": oldType, "newType": newType,"blobId": blobId, "taskId": taskId})
            };
        }

        const storeConfig = {
            siteID: process.env.NETLIFY_BLOBS_SITE_ID,
            token: process.env.NETLIFY_BLOBS_TOKEN
        };

        // 1. Obtener blob original
        const oldStore = getStore({ name: `${userId}-${oldType}`, ...storeConfig });
        const blob = await oldStore.get(blobId, { type: "blob" });

        if (!blob) {
            return {
                statusCode: 404,
                body: "Blob no encontrado en el store original"
            };
        }

        // 2. Guardar en nueva ubicación
        const newStore = getStore({ name: `${userId}-${newType}`, storeConfig });
        const newBlobId = `${taskId}-${blobId}`;
        await newStore.set(newBlobId, blob);

        // 3. Eliminar original
        await oldStore.delete(blobId);

        return {
            statusCode: 200,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ newBlobId })
        };
    } catch (error) {
        return { statusCode: 500, body: error.message };
    }
};