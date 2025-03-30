export class Attachment {
    constructor({
        id = null,
        name,
        blobUrl, 
        type,       // MIME type
        size,
        taskId,
        userId,
        createdAt = new Date().toISOString()
    }) {
        this.id = id;
        this.name = name;
        this.blobUrl = blobUrl;
        this.type = type;
        this.size = size;
        this.taskId = taskId;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    get fileType() {
        return this.type.split('/')[0]; // 'image', 'video', etc.
    }

    toFirestore() {
        return {
            name: this.name,
            blobUrl: this.blobUrl,
            type: this.type,
            size: this.size,
            taskId: this.taskId,
            userId: this.userId,
            createdAt: this.createdAt
        };
    }
}