import { useState, useEffect, useRef } from 'react';
import {FiCheckSquare, FiEdit, FiTrash, FiPaperclip, FiMapPin, FiAlertTriangle} from 'react-icons/fi';
import { SiGoogleassistant } from 'react-icons/si';
import { FaExclamationCircle } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAuth } from '../../../context/AuthContext';
import { updateTask, deleteTask } from '../../../service/TaskService/TaskService';
import { useNavigate } from 'react-router-dom';
import { useClickOutside } from '../../../Hooks/useClickOutside';

const Task = ({ task, onClick }) => {
    const [isCompleted, setIsCompleted] = useState(task.complete);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const menuRef = useRef();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 640px)').matches);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cerrar menú al hacer scroll
    useEffect(() => {
        const closeOnScroll = () => setShowMobileMenu(false);
        window.addEventListener('scroll', closeOnScroll);
        return () => window.removeEventListener('scroll', closeOnScroll);
    }, []);

    useClickOutside(menuRef, () => setShowMobileMenu(false));

    useEffect(() => {
        setIsCompleted(task.complete)
    }, [task.complete]);

    const handleDeleteConfirmation = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteTask = async () => {
        try {
            await deleteTask(task.id, currentUser.uid);
            setShowDeleteConfirm(false);
            onClick()
        } catch (error) {
            console.log("No se pudo eliminar la tarea, Error: ", error)
        }
    }

    const handleEdit = () => {
        navigate(`/dashboard/tasks/${task.id}?edit=true`); // Añadimos query param
    };

    const handleToggleComplete = async () => {
        try {
            setIsCompleted(!isCompleted)
            await updateTask(task.id, { complete: !task.complete}, currentUser.uid);
        } catch (error) {
            console.error("Error actualizando tarea:", error);
        }
    };

    const handleCancelar = () => {
        setShowDeleteConfirm(false);
    }

    return (
        <div className="group relative z-10 bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all duration-200" onClick={(e) => {if (!e.target.closest('button')) {navigate(`/dashboard/tasks/${task.id}`)}}} >
            {/* Contenido principal */}
            <div className="flex items-start gap-3 flex-wrap">
                {/* Checkbox y prioridad */}
                <div className="flex flex-row items-center gap-2 flex-shrink-0">
                    <button onClick={() => handleToggleComplete()} className="mt-1">
                        <FiCheckSquare className={`h-5 w-5 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                    </button>
                    <FaExclamationCircle className={`h-5 w-5 ${task.getPriorityColor()}`}/>
                </div>

                {/* Texto de la tarea */}
                <div className='flex-1 min-w-[200px] pr-6'>
                    <div className="flex flex-col md:flex-row gap-2">
                        <h3 className={`font-medium w-48 truncate ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                        </h3>
                        <p className="text-sm truncate text-gray-500 flex-1">
                            {task.description}
                        </p>
                    </div>
                </div>

                {/* Fecha - Visible normalmente */}
                <div className="text-sm text-gray-500 whitespace-nowrap flex-shrink-0">
                    <span>{task.dueDate}</span>
                </div>
            </div>
            
            {/* Botón de tres puntos para móvil */}
            {isMobile && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2" ref={menuRef}>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMobileMenu(!showMobileMenu);
                        }}
                        className="text-gray-500 p-1 hover:bg-gray-100 rounded-full"
                    >
                        <BsThreeDotsVertical className="h-5 w-5" />
                    </button>
                    {/* Menú móvil */}
                    {showMobileMenu && (
                        <div className="absolute right-0 -top-14 mt-1 bg-white rounded-lg shadow-lg border z-50 w-48">
                            <div className="p-2 flex">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEdit();
                                    }}
                                    className="w-full flex items-center px-1 py-1 rounded-md"
                                >
                                    <FiEdit className="text-blue-600" />
                                </button>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteConfirmation();
                                    }}
                                    className="w-full flex items-center px-1 py-1 rounded-md"
                                >
                                    <FiTrash className="text-red-600" />
                                </button>
                                <button className="text-purple-600 w-full flex items-center px-1 py-1 rounded-md">
                                    <FiPaperclip className="h-5 w-5" />
                                </button>
                                <button className="text-green-600 w-full flex items-center px-1 py-1 rounded-md">
                                    <FiMapPin className="h-5 w-5" />
                                </button>
                                <button className="text-orange-600 w-full flex items-center px-1 py-1 rounded-md">
                                    <SiGoogleassistant className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
            

            {/* Para desktop mantener el hover original pero ocultar en móvil */}
            {!isMobile && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 bg-white pl-2">
                    <button onClick={() => handleEdit()} className="text-gray-500 hover:text-blue-600">
                        <FiEdit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteConfirmation()} className="text-gray-500 hover:text-red-600">
                        <FiTrash className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-purple-600">
                        <FiPaperclip className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-green-600">
                        <FiMapPin className="h-5 w-5" />
                    </button>
                    <button className="text-gray-500 hover:text-orange-600">
                        <SiGoogleassistant className="h-5 w-5" />
                    </button>
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <FiAlertTriangle className="text-red-500 h-8 w-8" />
                            <h3 className="text-lg font-semibold">¿Eliminar tarea?</h3>
                        </div>
                        
                        <p className="text-gray-600 mb-6">
                            Esta acción es irreversible. ¿Estás seguro de que quieres eliminar 
                            la tarea <strong>"{task.title}"</strong>?
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => handleCancelar()}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDeleteTask()}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <FiTrash className="inline-block" />
                                Sí, Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Task;