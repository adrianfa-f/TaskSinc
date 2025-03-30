// blobs/move.js
import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
    try {
        const { userId, oldType, newType, blobId, taskId } = JSON.parse(event.body);

        // 1. Obtener blob original
        const oldStore = getStore({ name: `${userId}-${oldType}` });
        const blob = await oldStore.get(blobId, { type: "blob" });

        // 2. Guardar en nueva ubicación
        const newStore = getStore({ name: `${userId}-${newType}` });
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