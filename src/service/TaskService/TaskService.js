import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from "firebase/firestore";
import { db } from "../../firebase";

/* Crear una tarea */
export const createTask = async (task, userId) => { // Recibe userId como parámetro
    try {
        const taskCollection = collection(db, "users", userId, "tasks");
        const docRef = await addDoc(taskCollection, task);
        return {
            id: docRef.id, 
            ...task
        };
    } catch (error) {
        throw error;
    }
};

export const getTaskById = async (taskId, userId) => {
    try {
        const taskDocRef = doc(db, "users", userId, "tasks", taskId);
        const taskSnapshot = await getDoc(taskDocRef);
        
        if (!taskSnapshot.exists()) {
            throw new Error("La tarea no existe");
        }

        return { id: taskSnapshot.id, ...taskSnapshot.data() };
    } catch (error) {
        throw error;
    }
};

export const getTaskByUser = async (userId, filter = {}) => {
    try {
        let q = query(collection(db, "users", userId, "tasks"));
        console.log("el filtro aplicado es: ", filter)

        switch(filter.type) {
            case 'priority':
                q = query(q, where("priority", "==", filter.value));
                break;
            case 'completadas':
                q = query(q, where("complete", "==", true));
                break;
            case 'no-completadas':
                q = query(q, where("complete", "==", false));
                break
            case 'dueDate':
                const now = new Date().toISOString().split('T')[0];
                if (filter.value === 'vencidas') {
                    q = query(q, where("dueDate", "<", now))
                } else {
                    q = query(q, where("dueDate", ">=", now))
                }
                break;
        }

        if (filter.sortBy) {
            q = query(q, orderBy(filter.sortBy, filter.sortOrder))
        }
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id }));
    } catch (error) {
        throw error;
    }
};

export const updateTask = async (taskId, updates, userId) => { // Nueva firma
    try {
        const taskDocRef = doc(db, "users", userId, "tasks", taskId);
        await updateDoc(taskDocRef, updates);
    } catch (error) {
        throw error;
    }
}

export const deleteTask = async (taskId, userId) => { // Nueva firma
    try {
        const taskDocRef = doc(db, "users", userId, "tasks", taskId);
        await deleteDoc(taskDocRef);
    } catch (error) {
        throw error;
    }
};