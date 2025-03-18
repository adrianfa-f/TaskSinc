import React from "react";

const About = () => (
    <section className="pt-12" id="about">
        <div className="bg-blue-50 p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-blue-800 mb-4">Sobre Nosotros</h2>
            <p className="text-lg text-gray-700 mb-6">
                Somos un equipo dedicado a facilitar la gestión de tareas y la productividad diaria.
                Nuestra misión es crear herramientas intuitivas y eficaces que te ayuden a organizar tu
                tiempo y alcanzar tus metas con mayor facilidad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Nuestra Misión</h3>
                    <p className="text-gray-600">
                        Proporcionar soluciones innovadoras que simplifiquen la gestión de tareas y mejoren
                        la productividad de nuestros usuarios.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-medium text-blue-800 mb-2">Nuestros Valores</h3>
                    <p className="text-gray-600">
                        La transparencia, la innovación y el compromiso con nuestros usuarios son los pilares
                        que guían nuestro trabajo diario.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default About;