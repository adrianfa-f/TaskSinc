import Task from './Task';
import NewTaskButton from './NewTaskButton';
import TaskForm from './TaskForm';
import { Task as TaskModel } from '../../../models/Task';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getTaskByUser } from '../../../service/TaskService/TaskService';

const TaskList = ({currentFilter, searchQuery}) => {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadList, setReloadList] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 10;
    const priorityOrder = {
        high: 1,
        medium: 2,
        low: 3
    }


    const filteredTasks = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return tasks.filter(task => {
            if (!query) return true;

            const titleMatch = task.title.toLowerCase().includes(query);
            const descMatch = task.description?.toLowerCase().includes(query) || false;
            const locationMatch = task.location?.toLowerCase().includes(query) || false;
            const priorityMatch = task.priority?.toLowerCase().includes(query) || false;
            const dueMatch = task.dueDate.toLowerCase().includes(query);
            return (titleMatch || descMatch || locationMatch || priorityMatch || dueMatch)

        })
    }, [tasks, searchQuery])

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (currentUser?.uid) {
                    const firestoreTasks = await getTaskByUser(currentUser.uid, currentFilter);
                    
                    // Convertir documentos de Firestore a instancias de Task
                    let tasksData = firestoreTasks.map(doc => {
                        const data = doc;
                        return new TaskModel({
                            id: data.id,
                            title: data.title,
                            description: data.description,
                            dueDate: data.dueDate,
                            creationDate: data.creationDate,
                            priority: data.priority,
                            attachments: data.attachments,
                            location: data.location,
                            complete: data.complete
                        });
                    });
                    if(currentFilter.type === "importantes") {
                        tasksData = tasksData.sort((a,b) => {
                            return priorityOrder[a.priority]-priorityOrder[b.priority];
                        })
                    }
                    
                    setTasks(tasksData);
                }
            } catch (err) {
                setError('Error cargando tareas: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, showForm, reloadList, currentFilter]); // Actualizar cuando se cree nueva tarea

    // Paginación
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * tasksPerPage;
        return filteredTasks.slice(startIndex, startIndex +tasksPerPage);
    }, [filteredTasks, currentPage]);

    // Cargar más tareas
    const loadMoreTasks = () => {
        setCurrentPage(prev => prev + 1);
    };

    const loadPreviousTasks = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1)
        } 
        
    }

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!loading && filteredTasks.length === 0) {
        return (
            <div className="p-8 text-center max-w-md mx-auto mt-8">
                <NewTaskButton onClick={() => setShowForm(true)} />
                {showForm && <TaskForm onClose={() => setShowForm(false)} />}
                <div className="inline-block mb-4 text-blue-400">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-16 w-16" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    ¡Vaya, no hay nada aquí!
                </h3>
                <p className="text-gray-500 text-sm">
                    {searchQuery ? 
                        `No encontramos resultados para "${searchQuery}"` : 
                        "Parece que no hay tareas con estos filtros"
                    }
                </p>
                <p className="text-gray-400 text-sm mt-2">
                    Prueba con otros criterios o crea una nueva tarea
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg mx-4">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <NewTaskButton onClick={() => setShowForm(true)} />
            {showForm && <TaskForm onClose={() => setShowForm(false)} />}

            {paginatedTasks.map((task, index) => (
                <Task key={index} task={task} onClick={() => setReloadList(!reloadList)} />
            ))}

            {filteredTasks.length > paginatedTasks.length && (
                <div className="flex justify-center space-x-12 mt-4 ">
                    <button
                        onClick={loadPreviousTasks}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Anterior
                    </button>
                    <label className="bg-gray-500 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-md">
                        {currentPage}-{Math.ceil(filteredTasks.length/tasksPerPage)}
                    </label>
                    <button
                        onClick={loadMoreTasks}
                        disabled={currentPage*tasksPerPage>=filteredTasks.length}
                        className="px-4 py-2 z-20 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;