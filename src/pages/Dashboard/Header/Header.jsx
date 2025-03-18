import ProfileMenu from './ProfileMenu';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import logo from '../../../assets/images/DashboardLogoOK.png'

const Header = ({onSearch}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = e => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value)
    }

    return (
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
            {/* Input de búsqueda y logo */}
            <div className="flex items-center space-x-4">
                <div className="logo">
                    <img src={logo} className="h-12" alt="logo"/>
                </div>
            </div>

            {/* Input de busqueda */}
            <div className="flex-1 max-w-xl mx-4">
                <div className="relative">
                    <FiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Buscar tareas..." className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={handleSearch}/>
                </div>
            </div>

            {/* Menú de perfil */}
            <ProfileMenu />
        </header>
    );
};

export default Header;