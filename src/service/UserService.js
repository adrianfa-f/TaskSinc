import { getFirestore,doc,getDoc,setDoc,updateDoc} from 'firebase/firestore';
import { app } from '../firebase';
import { User } from '../models/User';  

export class UserService {
    static db = getFirestore(app);

    static async createUser(uid, userData) {
            const user = new User({
                uid,
                email: userData.email,
                displayName: userData.displayName,
                photoURL: userData.photoURL || ''
            });

            await setDoc(doc(this.db, 'users', uid), user.toFirestore());
        }

    static async getUserById(uid) {
        const docRef = doc(this.db, 'users', uid);
        const docSnap = await getDoc(docRef);
        
        if (!docSnap.exists()) throw new Error('User not found');
        
        const data = docSnap.data();
        return new User({
            uid,
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL
        });
    };

    static async updateUser(uid, updates) {
        try {
            const allowedUpdates = ['displayName', 'photoURL'];
            const validUpdates = Object.keys(updates).filter(key => allowedUpdates.includes(key)).reduce((obj, key) => {
                    obj[key] = updates[key];
                    return obj;
                }, {});
                
            
            if (Object.keys(validUpdates).length === 0) {
                throw new Error('No hay campos válidos para actualizar');
            }

            // Actualización en Firestore
            const userRef = doc(this.db, 'users', uid);
            await updateDoc(userRef, validUpdates);

            // Devuelve el usuario actualizado
            return this.getUserById(uid);
        } catch (error) {
            throw new Error(`Error actualizando usuario: ${error.message}`);
        }
    }
}