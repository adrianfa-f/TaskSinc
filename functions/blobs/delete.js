import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
    try {
        const { userId, type, blobId } = event.queryStringParameters;
        
        const store = getStore({
            name: `${userId}-${type}`,
            siteID: process.env.NETLIFY_BLOBS_SITE_ID,
            token: process.env.NETLIFY_BLOBS_TOKEN,
        });

        await store.delete(blobId);

        return {
            statusCode: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "DELETE"
            },
            body: ""
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            body: error.message,
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        };
    }
};