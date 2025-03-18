import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import Header from "../components/Header";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [text, setText] = useState("Inicia sesión");
    const [message, setMessage] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const forgotPassword = e.nativeEvent.submitter.id === "resetPassword"

        if (!email) {
            setMessage("Necesitamos un correo electrónico")
        } else {
            if (forgotPassword) {
                try {
                    await sendPasswordResetEmail(auth, email)
                    setMessage("Se ha enviado un correo electrónico para restablecer tu contraseña.")
                } catch (error) {
                    console.log('Error al enviar el correo de reseteo: ', error)
                }
            } else {
                try {
                    const userCredentials = await signInWithEmailAndPassword(auth, email, password);
                    const user = userCredentials.user;

                    // Recargar información del usuario para obtener el estado más reciente
                    await user.reload();
                    console.log(user.emailVerified)

                    if (user.emailVerified) {
                        console.log("Inicio de sesión exitoso");
                        navigate('/dashboard');
                    } else {
                        try {
                            setText("Reenviar Email")
                            await sendEmailVerification(user);
                            console.log("Correo enviado. Por favor verifica tu correo.");
                        } catch (verificationError) {
                            console.log("Error al reenviar el correo de verificación:", verificationError);
                        }
                    }
                } catch (error) {
                    console.log("Error en el inicio de sesión:", error);
                }
            }
        }
    };

    return (
        <div className='flex justify-center pt-8'>
            <Header />
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <form onSubmit={handleSubmit} className='pt-16'>
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input type='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <p className={`text-blue-500 text-center text-sm font-bold mt-2`}>
                    {message}
                    </p>
                    <div className={`flex items-center justify-center mb-4`}>
                        <button type='submit' className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline transition-all duration-300 w-32">{text}</button>
                    </div>
                    <div className='flex items-center justify-between'>
                        <button id="resetPassword" type='submit' className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Olvide mi contraseña</button>
                        <a href="./signup" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">Crear cuenta</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
