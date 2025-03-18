import { useState, useEffect } from 'react';
import {FiCheckSquare, FiEdit, FiTrash, FiPaperclip, FiMapPin, FiAlertTriangle} from 'react-icons/fi';
import { SiGoogleassistant } from 'react-icons/si';
import { FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import { updateTask, deleteTask } from '../../../service/TaskService/TaskService';
import { useNavigate } from 'react-router-dom';

const Task = ({ task, onClick }) => {
    const [isCompleted, setIsCompleted] = useState(task.complete);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

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
        navigate(-1)
    }

    return (
        <div className="group relative bg-white px-4 py-2 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all duration-200" onClick={(e) => {if (!e.target.closest('button')) {navigate(`/dashboard/tasks/${task.id}`)}}} >
            {/* Contenido principal */}
            <div className="flex items-start gap-3">
                {/* Checkbox y prioridad */}
                <div className="flex flex-row items-center gap-2">
                    <button onClick={() => handleToggleComplete()} className="mt-1">
                        <FiCheckSquare className={`h-5 w-5 ${isCompleted ? 'text-green-500' : 'text-gray-300'}`} />
                    </button>
                    <FaExclamationCircle className={`h-5 w-5 ${task.getPriorityColor()}`}/>
                </div>

                {/* Texto de la tarea */}
                <div className='flex-1'>
                    <div className="flex flex-row">
                        <h3 className={`font-medium w-48 truncate ${isCompleted ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                        </h3>
                        <p className="text-sm truncate text-gray-500 mt-1 max-w-xl">
                            {task.description}
                        </p>
                    </div>
                </div>

                {/* Fecha - Visible normalmente */}
                {/* agegar task.formatDate a las dates cuando se ponga en marcha la lectura */}
                <div className="text-sm text-gray-500 whitespace-nowrap">
                    <span>{task.dueDate}</span>
                </div>
            </div>

            {/* Acciones - Aparecen en hover */}
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