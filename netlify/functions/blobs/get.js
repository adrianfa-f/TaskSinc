import { getStore } from "@netlify/blobs";

export default async (req, res) => {
    const { userId, type, blobId } = req.query;
    
    const store = getStore({
        name: `${userId}-${type}`,
        siteID: process.env.NETLIFY_BLOBS_SITE_ID,
        token: process.env.NETLIFY_BLOBS_TOKEN,
    });

    const blob = await store.get(blobId, { type: "blob" });

    res.setHeader("Content-Type", blob.type);
    res.send(blob);
};