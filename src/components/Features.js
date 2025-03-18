import React from "react";
import InterfazImg from "../assets/images/InterfazImg.png";
import TaskList from "../assets/images/—Pngtree—vector checklist icon_3782872.png";
import Notificacion from "../assets/images/notificacionOk.png";
import comoFunciona1 from "../assets/images/browser abierto con un gestor de tareas.png";
import comoFunciona2 from "../assets/images/una aplicación de gestión de tareas con funcionalidades claras.png";

const Features = () => (
    <section id="feature" className="m-8 pt-20">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold">Características</h2>
                <p className="text-lg text-gray-600 mt-4">Descubre las funciones que hacen de SincTask la mejor herramienta para gestionar tus tareas.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Característica 1 */}
                <div className="bg-gray-100 shadow-md p-4 rounded-lg group hover:text-white hover:bg-blue-600 transition-all duration-300">
                    <img src={InterfazImg} className="w-36 h-20 mx-auto mb-4 group-hover:h-24 group-hover:w-40 transition-all duration-300" alt="interfaz intuitiva" />
                    <h3 className="text-2xl font-semibold">Interfaz Intuitiva</h3>
                    <ul className="list-disc list-inside text-gray-600  group-hover:text-white transition-color duration-300">
                        <li>Diseño limpio y fácil de usar</li>
                        <li>Añadir, editar y eliminar tareas sin complicaciones</li>
                        <li>Navegación intuitiva y rápida</li>
                    </ul>
                </div>
                {/* Característica 2 */}
                <div className="bg-gray-100 shadow-md p-4 rounded-lg hover:text-white group hover:bg-blue-600 transition-all duration-300">
                    <img src={TaskList} alt="Icono de Lista de Tareas" className="w-20 h-20 mx-auto mb-4 group-hover:h-24 group-hover:w-24 transition-all duration-300" />
                    <h3 className="text-2xl font-semibold">Lista de Tareas</h3>
                    <ul className="list-disc list-inside text-gray-600 group-hover:text-white transition-color duration-300">
                        <li>Crea listas de tareas personalizadas</li>
                        <li>Organiza en categorías</li>
                        <li>Ordena por prioridad o fecha de vencimiento</li>
                    </ul>
                </div>
                {/* Característica 3 */}
                <div className="bg-gray-100 shadow-md p-4 rounded-lg group hover:text-white hover:bg-blue-600 transition-all duration-300">
                    <img src={Notificacion} alt="Icono de Recordatorios" className="w-28 h-20 mx-auto mb-4 group-hover:h-24 group-hover:w-32 transition-all duration-300" />
                    <h3 className="text-2xl font-semibold">Recordatorios y Notificaciones</h3>
                    <ul className="list-disc list-inside text-gray-600  group-hover:text-white transition-color duration-300">
                        <li>Recordatorios automáticos</li>
                        <li>Notificaciones oportunas</li>
                        <li>Alertas para tareas pendientes</li>
                    </ul>
                </div>
            </div>
            <div className="hidden mt-8 sm:block">
                <h3 className="text-2xl font-semibold text-center">Mira Cómo Funciona</h3>
                <div className="flex justify-center mt-4">
                    <img src={comoFunciona1} alt="Captura de pantalla 1" className="w-2/3 h-64 px-8 mx-2" />
                    <img src={comoFunciona2} alt="Captura de pantalla 2" className="w-2/3 h-64 px-8 mx-2" />
                </div>
            </div>
            <div className="text-center mt-8">
                <a href="/signup" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Regístrate Ahora</a>
            </div>
        </section>
);

export default Features;