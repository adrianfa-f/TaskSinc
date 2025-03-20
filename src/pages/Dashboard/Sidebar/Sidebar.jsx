import { useState } from "react";

const Sidebar = ({setCurrentFilter, isMobileOpen, toggleMobileMenu}) => {
    const [isSelected, setIsSelected] = useState("Todas");
    const [subFilter, setSubFilter] = useState('');

    const closeByWidth = (type) => {
        if (window.innerWidth < 375 && type !== "Vencimiento" && type !== "Importantes") {
            toggleMobileMenu()
        }
    }
    
    const handleMainFilter = (type, sortBy = "creationDate", sortOrder = "desc") => {
        closeByWidth(type)
        setIsSelected(type);
        setSubFilter('');
        setCurrentFilter({
            type: type.toLowerCase(),
            value: null,
            sortBy: sortBy,
            sortOrder: sortOrder
        })
    }

    const handlePriorityFilter = (priority) => {
        closeByWidth()
        setSubFilter(priority);
        setCurrentFilter({
            type: 'priority',
            value: priority,
            sortBy: 'creationDate',
            sortOrder: 'desc'
        })
    };

    const handleDueDtaeFilter = (filterType) => {
        closeByWidth()
        setSubFilter(filterType);
        setCurrentFilter({
            type: 'dueDate',
            value: filterType,
            sortBy: 'dueDate',
            sortOrder: 'asc'
        });
    }

    return (
        <aside className={` fixed md:static z-20 h-full transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-200 ease-in-out w-64 bg-white border-r flex flex-col`}>
            
            <div className="pr-4 space-y-1 ">
                <button className={`w-full text-left px-4 py-2 rounded-r-full ${isSelected==="Todas" ? "bg-blue-100" : "hover:bg-gray-200 bg-gray-50 text-blue-700"} `} onClick={() => handleMainFilter("Todas")}>Todas las tareas</button>
                <button className={`w-full text-left px-4 py-2 rounded-r-full ${isSelected==="Importantes" ? "bg-blue-100" : "hover:bg-gray-200 bg-gray-50 text-blue-700"} `} onClick={() => handleMainFilter("Importantes")}>Prioridad</button>

                {/* Menu de prioridad */}
                <div className={`space-y-1 ${isSelected==="Importantes" ? '' : 'hidden'}`}>
                    <button className={`text-left px-4 py-2 rounded-r-full ${subFilter==="low" ?  "w-3/4 bg-green-600 text-white":"w-2/3 bg-gray-50 hover:w-3/4 hover:bg-gray-200"} transition-all duration-500 ease-in-out`} onClick={() => handlePriorityFilter("low")}>Baja</button>
                    <button className={`text-left px-4 py-2 rounded-r-full ${subFilter==="medium" ?  "w-3/4 bg-yellow-600 text-white":"w-2/3 bg-gray-50 hover:w-3/4 hover:bg-gray-200"} transition-all duration-500 ease-in-out`} onClick={() => handlePriorityFilter("medium")}>Media</button>
                    <button className={`text-left px-4 py-2 rounded-r-full ${subFilter==="high" ?  "w-3/4 bg-red-600 text-white":"w-2/3 bg-gray-50 hover:w-3/4 hover:bg-gray-200"} transition-all duration-500 ease-in-out`} onClick={() => handlePriorityFilter("high")}>Alta</button>
                </div>
                    
                <button className={`w-full text-left px-4 py-2 rounded-r-full ${isSelected==="Completadas" ? "bg-blue-100" : "hover:bg-gray-200 bg-gray-50 text-blue-700"} `} onClick={() => handleMainFilter("Completadas", "creationDate", "desc")}>Completdas</button>
                <button className={`w-full text-left px-4 py-2 rounded-r-full ${isSelected==="No-completadas" ? "bg-blue-100" : "hover:bg-gray-200 bg-gray-50 text-blue-700"} `} onClick={() => handleMainFilter("No-completadas", "creationDate", "desc")}>No completadas</button>
                <button className={`w-full text-left px-4 py-2 rounded-r-full ${isSelected==="Vencimiento" ? "bg-blue-100" : "hover:bg-gray-200 bg-gray-50 text-blue-700"} `} onClick={() => handleMainFilter("Vencimiento", "dueDate", "asc")}>Vencimiento</button>

                {/* Menu de vencimiento */}
                <div className={`space-y-1 ${isSelected==="Vencimiento" ? '' : 'hidden'}`}>
                    <button className={`text-left px-4 py-2 rounded-r-full ${subFilter==="no-vencidas" ?  "w-3/4 bg-green-600 text-white":"w-2/3 bg-gray-50 hover:w-3/4 hover:bg-gray-200"} transition-all duration-500 ease-in-out`} onClick={() => handleDueDtaeFilter("no-vencidas")}>Por fecha</button>
                    <button className={`text-left px-4 py-2 rounded-r-full ${subFilter==="vencidas" ?  "w-3/4 bg-gray-800 text-white":"w-2/3 bg-gray-50 hover:w-3/4 hover:bg-gray-200"} transition-all duration-500 ease-in-out`} onClick={() => handleDueDtaeFilter("vencidas")}>Vencidas</button>
                </div>
            </div>
        </aside>
    )
};

export default Sidebar;