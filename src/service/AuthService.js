import { getAuth, signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut } from 'firebase/auth';
import { app } from '../firebase';


export class AuthService {
    static auth = getAuth(app);

    static async login(email, password) {
        try {
            return await signInWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            throw new Error(this._translateFirebaseError(error.code));
        }
    }
    static async signup(email, password) {
        try {
            return await createUserWithEmailAndPassword(this.auth, email, password);
            
        } catch (error) {
            throw new Error(this._translateFirebaseError(error.code));
        }
    }

    static async logout() {
        await signOut(this.auth);
    }
    static _translateFirebaseError(errorCode) {
        const errors = {
            'auth/user-not-found': 'Usuario no registrado',
            'auth/wrong-password': 'Contraseña incorrecta',
            'auth/email-already-in-use': 'El email ya está registrado',
            // Agregar más códigos según lo necesite
        };
        return errors[errorCode] || 'Error desconocido';
    }
}