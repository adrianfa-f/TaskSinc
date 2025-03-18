import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => (
    <section className="cta p-8 text-center bg-blue-500 text-white">
        <h2 className="text-3xl mb-4">¡Empieza Ahora!</h2>
        <Link to="/signup" className="bg-white text-blue-500 px-4 py-2">Regístrate</Link>
    </section>
);

export default CTASection;