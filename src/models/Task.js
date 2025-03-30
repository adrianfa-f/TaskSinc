export class Task {
    constructor({id = null, title, description = "Sin descripcion", dueDate, creationDate = new Date().toISOString(),priority = "medium", attachments = [], location = null, complete = false}) {
        if (!title || !dueDate) {
            throw new Error("Title y dueDate son requeridos")
        }
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.creationDate = creationDate;
        this.priority = priority;
        this.location = location;
        this.complete = complete;
    }

    toFirestore() {
        return {
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            creationDate: this.creationDate,
            priority: this.priority,
            location: this.location,
            complete: this.complete,

        }
    }

    get formattedDueDate() {
        return new Date(this.dueDate).toLocaleDateString();
    }

    get formattedCreationDate() {
        return new Date(this.creationDate).toLocaleDateString();
    }

    getPriorityColor() {
        return {
            low: "text-green-500",
            medium: "text-yellow-500",
            high: "text-red-500",
        }[this.priority]
    }
}

