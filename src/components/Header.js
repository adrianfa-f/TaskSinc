import React from "react";
import { useState } from "react";
import {Link} from "react-router-dom";
import logo from "../assets/images/SyncTaskLogo.png";
import "../styles/App.css";
import Menu from "./Menu"
import MenuLink from "./MenuLink";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
    setIsOpen(!isOpen);
    };

    return (
    <header className="bg-blue-900 text-white justify-between px-5 h-16 flex items-center fixed top-0 w-full z-50">
        <div className="logo">
        <img src={logo} className="h-14" alt="logo"/>
        </div>
        <nav className="flex space-x-4 hidden sm:block">
            <Link className="hover:text-orange-500 transition-colors duration-300" to="/" onClick={() => window.scrollTo({top:0,behavior:"smooth"})}>Inicio</Link>
            <MenuLink className="hover:text-orange-500 transition-colors duration-300" to="feature" >Caracteristicas</MenuLink>
            <MenuLink className="hover:text-orange-500 transition-colors duration-300" to="about" >Sobre nosotros</MenuLink>
            <Link className="hover:text-orange-500 transition-colors duration-300" to="/signup">Registro</Link>
            <Link className="hover:text-orange-500 transition-colors duration-300" to="/login">Inicio de sesion</Link>
        </nav>
        <div className="sm:hidden flex items-center" onClick={toggleMenu}>
            <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <rect id="recta1" width="35" height="5" x="7.5" y="10" rx="2.5" className="rect"/>
                <rect id="recta2" width="35" height="5" x="7.5" y="20" rx="2.5" className="rect"/>
                <rect id="recta3" width="35" height="5" x="7.5" y="30" rx="2.5" className="rect"/>
            </svg>   
        </div>
        <Menu isOpen={isOpen} toggleMenu={toggleMenu} />
    </header>
)};

export default Header;