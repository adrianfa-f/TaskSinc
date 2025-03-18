export class User {
    constructor({uid, email, displayName, photoURL = ""}) {
        if (!email  || !displayName) {
            throw new Error("Faltan campos obligatorios: email o displayName.");
        }

        this.email = email;
        this.displayName = displayName;
        this.photoURL = photoURL;
    }

    getInitials() {
        return this.displayName.split(" ").map((name) => name[0]).join("").toUpperCase();
    }

    getFullName() {
        return this.displayName;
    }

    toFirestore() {
        return {
            email: this.email,
            displayName: this.displayName,
            photoURL: this.photoURL,
        }
    }
}