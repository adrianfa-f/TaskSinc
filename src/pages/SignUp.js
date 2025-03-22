import React, {useState} from 'react';
import {auth, db} from '../firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification  } from 'firebase/auth';
import Header from "../components/Header";
import PasswordStrength from '../components/PasswordStrength';
import {doc, setDoc} from 'firebase/firestore';
import {User} from "../models/User";

const SignUp = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlerSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true)

        if (!userName||!email||!password) {
            setMessage("Tiene que rellenar todos los campos")
        } else {
            try {
                /* Crear el usuario */
                const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
                /* Actualizar el displayName */
                const user = userCredentials.user
                await updateProfile(user, {displayName: userName});
                await sendEmailVerification(user, 
                    {
                        url: `${window.location.origin}/login`
                    }
                );

                setMessage("Por favor verifica tu correo electrónico. Revisa tu bandeja de entrada.")
                
                /* Crear una instancia de User */
                const newUser = new User({
                    email: user.email,
                    displayName: user.displayName,
                });
                /* Guardar la instancia de user en firebase */
                await setDoc(doc(db, "users", user.uid), 
                    newUser.toFirestore()
                );
                
                
            } catch (error) {
                console.error('Error: ', error);
            } finally {
                setIsSubmitting(false)
            }
        };
    }



    return (
        <div className='flex justify-center pt-16'>
            <Header/>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md pt-8">
                <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
                <form onSubmit={handlerSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Nombre de Usuario
                        </label>
                        <input
                        type='text' value={userName} onChange={e => setUserName(e.target.value)} placeholder='Nombre de Usuario'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                        </label>
                        <input
                        type='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Contraseña
                        </label>
                        <input
                        type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password'
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <PasswordStrength password={password}/>
                    </div>
                    <p className="text-red-500 text-center text-sm font-bold mt-2">
                    {message}
                    </p>
                    <div className="flex items-center justify-center">
                        <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 w-32 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                        {isSubmitting ? "Creando cuenta..." : "Registrarse"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
            
    )
};

export default SignUp