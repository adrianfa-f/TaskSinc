import ProfileMenu from './ProfileMenu';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { FaBars } from 'react-icons/fa';
import logo from '../../../assets/images/DashboardLogoOK.png'
import { useLocation } from 'react-router-dom';

const Header = ({onSearch, toggleMobileMenu}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation()
    const isHidden = location.pathname.includes("/dashboard/tasks")&&window.innerWidth<375
    const handleSearch = e => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value)
    }

    return (
        <header className={`bg-white shadow-sm py-4 px-6  flex items-center justify-between sticky top-0 z-50 transition-transform duration-500 ${
        isHidden ? "opacity-0 h-0 py-0 -mt-4" : "opacity-100 h-auto"}`}>
            {/* Input de búsqueda y logo */}
            <div className=" hidden md:flex items-center space-x-4">
                <div className="logo">
                    <img src={logo} className="h-12" alt="logo"/>
                </div>
            </div>

            {/* Input de busqueda */}
            <div className="flex-1 max-w-xl mx-4">
                <div className="relative">
                    <FaBars onClick={toggleMobileMenu} className="absolute md:hidden left-3 top-3 h-5 w-5 text-gray-400" />
                    <FiSearch className="absolute hidden md:flex left-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Buscar tareas..." className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={handleSearch}/>
                </div>
            </div>

            {/* Menú de perfil */}
            <ProfileMenu />
        </header>
    );
};

export default Header;