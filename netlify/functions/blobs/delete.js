import { getStore } from "@netlify/blobs";

export default async (req, res) => {
    const { userId, type, blobId } = req.query;
    
    const store = getStore({
        name: `${userId}-${type}`,
        siteID: process.env.NETLIFY_BLOBS_SITE_ID,
        token: process.env.NETLIFY_BLOBS_TOKEN,
    });

    // Eliminar el blob
    await store.delete(blobId);
    res.status(204).end();
};