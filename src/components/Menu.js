import React from 'react';
import {Link} from "react-router-dom";
import MenuLink from './MenuLink';

const Menu = ({ isOpen, toggleMenu }) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-end z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}   transition-transform duration-300`} onClick={toggleMenu}
        >       
            <div className="w-64 bg-gray-900 p-4">
                <nav className="space-y-4">
                    <Link className="block text-white hover:text-gray-400" to="/" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Inicio</Link>
                    <MenuLink className="block text-white hover:text-gray-400" to="feature">Caracteristicas</MenuLink>
                    <MenuLink className="block text-white hover:text-gray-400" to="about">Sobre nosotros</MenuLink>
                    <Link className="block text-white hover:text-gray-400" to="/signup">Registro</Link>
                    <Link className="block text-white hover:text-gray-400" to="/login">Inicio de sesion</Link>
                </nav>
            </div>
        </div>
    );
};

export default Menu;


