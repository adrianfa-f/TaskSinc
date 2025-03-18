import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => (
    <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2025 MyApp. Todos los derechos reservados.</p>
        <div className="social-icons mt-4">
            <FaFacebook className="mr-2" />
            <FaTwitter className="mr-2" />
            <FaInstagram />
        </div>
    </footer>
);

export default Footer;