import { db } from "../firebase";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { Attachment } from "../models/Attachment";

export class AttachmentService {
    static async createAttachment(attachmentData, userId, taskId) {
        try {
            const attachmentsRef = collection(db, "users", userId, "tasks", taskId, "attachments");
            const docRef = await addDoc(attachmentsRef, attachmentData.toFirestore());
            return new Attachment({ ...attachmentData, id: docRef.id });
        } catch (error) {
            throw new Error(`Error creando adjunto: ${error.message}`);
        }
    }

    static async getAttachmentsByTask(userId, taskId) {
        try {
            const attachmentsRef = collection(db, "users", userId, "tasks", taskId, "attachments");
            const snapshot = await getDocs(attachmentsRef);
            return snapshot.docs.map(doc => 
                new Attachment({ id: doc.id, ...doc.data() })
            );
        } catch (error) {
            throw new Error(`Error obteniendo adjuntos: ${error.message}`);
        }
    }

    static async deleteAttachment(userId, taskId, attachmentId) {
        try {
            const attachmentRef = doc(db, "users", userId, "tasks", taskId, "attachments", attachmentId);
            await deleteDoc(attachmentRef);
        } catch (error) {
            throw new Error(`Error eliminando adjunto: ${error.message}`);
        }
    }
}