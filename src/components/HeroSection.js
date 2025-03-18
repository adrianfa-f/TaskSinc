import React from "react";
import {Link} from "react-router-dom";
import heroSectionImg from "../assets/images/heroSectionOkshort.png"

const HeroSection = () => (
    <section className="flex flex-col bg-white md:flex-row items-center md:justify-between p-6">
        <div className="md:w-1/2">
            <img src={heroSectionImg} alt="Hero" className="w-full h-1/2 object-cover"/>
        </div>
      {/* Texto y botones a la derecha */}
        <div className="md:w-1/2 md:mt-0 md:pl-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 sm:mb-12">Gestión de Tareas Simplificada</h1>
            <p className="mt-4 text-lg text-gray-600 sm:mb-16">Organiza tu vida, mejora tu productividad y alcanza tus metas con nuestra herramienta de gestión de tareas intuitiva y poderosa. ¡Regístrate ahora y transforma la manera en que trabajas y te organizas!</p>
            <nav className="mt-6 flex flex-col space-y-4 sm:block sm:space-x-4"> 
                <Link to="/signup"  className="px-6 py-3 bg-gray-600 text-white rounded-full shadow hover:scale-105 hover:bg-blue-500 transition-color duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blu-500">Registrate</Link>
                <Link to="/login" className="px-6 py-3 bg-gray-100 text-black rounded-full shadow border-2 transition-colors duration-300 hover:text-gray-100 hover:bg-orange-500">Comencemos</Link>
            </nav>
        </div>
    </section>
);

export default HeroSection