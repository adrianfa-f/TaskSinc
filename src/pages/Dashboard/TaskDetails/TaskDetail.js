import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getTaskById, updateTask } from '../../../service/TaskService/TaskService';
import { Task } from '../../../models/Task';
import { FiArrowLeft, FiPaperclip, FiMapPin, FiSave } from 'react-icons/fi';
import { FaExclamationCircle } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import AttachmentPreview from './AttachmentPreview';
import { AttachmentService } from '../../../service/AttachmentService';
import { Attachment } from '../../../models/Attachment';

const TaskDetail = () => {
    const { taskId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams()
    const [task, setTask] = useState(null);
    const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true');
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState();
    const location = useLocation()
    const isHidden = location.pathname.includes("/dashboard/tasks")&&window.innerWidth<375
    const [attachments, setAttachments] = useState([]);

    const handleFileUpload = async (files) => {
        setUploading(true);
        try {
            const newAttachments = await Promise.all(
                Array.from(files).map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    
                    const response = await fetch(
                        `/.netlify/functions/blobs/upload?    userId=${currentUser.uid}&    type=attachments`,
                        { method: "POST", body: formData }
                    );

                    const { publicUrl, mimeType } = await response.json();

                    const newAttachment = new Attachment({
                        name: file.name,
                        blobUrl: publicUrl,
                        type: mimeType,
                        size: file.size,
                        taskId: taskId,
                        userId: currentUser.uid
                    });

                    await AttachmentService.createAttachment(
                        newAttachment,
                        currentUser.uid,
                        taskId
                    );

                    return newAttachment;
                })
            );

            setAttachments([...attachments, ...newAttachments]);
        } finally {
            setUploading(false);
        }
    };

      // Función de eliminación
    const handleDeleteAttachment = async (attachment) => {
        await AttachmentService.deleteAttachment(
            currentUser.uid,
            taskId,
            attachment.id
        );
        
        await fetch(`/.netlify/functions/blobs/delete`, {
            method: "DELETE",
            body: JSON.stringify({ url: attachment.blobUrl }),
            headers: { "Content-Type": "application/json" }
        });
        
        setAttachments(attachments.filter(a => a.id !== attachment.id));
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const taskData = await getTaskById(taskId, currentUser.uid);
                setTask(new Task(taskData));
                setFormData(taskData);
                
            } catch (error) {
                setError('Error cargando la tarea: ', error);
            }
        };

        if (taskId && currentUser) {
            fetchTask()
        };
    }, [taskId, currentUser]);

    const handleLocationChange = (e) => {
        setFormData(prev => ({ 
            ...prev, 
            location: {
                ...prev.location,
                [e.target.name]: e.target.value
            }
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateTask(taskId, formData, currentUser.uid);
            setIsEditing(false);
            // Actualizar datos locales
            setTask(new Task({...formData, id: taskId}));
        } catch (error) {
            setError('Error actualizando la tarea');
        }
    };

    if (error) return <div className="p-6 text-red-500">{error}</div>;
    if (!task) return <div className="p-6">Cargando...</div>;

    return (
        <div className={`p-4 md:p-6 max-w-3xl mx-auto h-[calc(100vh-100px)] overflow-y-auto ${isHidden?"fixed top-0":""}`}>
            <button
                onClick={() => navigate(-1)}
                className="mb-4 px-3 py-1 md:px-5 md:py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 text-sm"
            >
                <FiArrowLeft className="inline-block" />
                Volver a la lista
            </button>
    
            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Encabezado Edición */}
                    <div className="pb-4 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">Editar Tarea</h1>
                        <p className="text-sm text-gray-500 mt-1">Modifica los campos necesarios</p>
                    </div>
    
                    {/* Campos Principales */}
                    <div className="space-y-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
    
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Añade detalles importantes..."
                            />
                        </div>
    
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Límite *</label>
                                <input
                                    type="date"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
    
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad *</label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>
    
                        {/* Sección Ubicación */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <FiMapPin className="text-blue-600" />
                                <h3 className="font-medium text-gray-700">Ubicación</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="text"
                                    name="latitude"
                                    placeholder="Latitud"
                                    value={formData.location?.latitude || ''}
                                    onChange={handleLocationChange}
                                    className="p-2 border rounded-md bg-white"
                                    disabled
                                />
                                <input
                                    type="text"
                                    name="longitude"
                                    placeholder="Longitud"
                                    value={formData.location?.longitude || ''}
                                    onChange={handleLocationChange}
                                    className="p-2 border rounded-md bg-white"
                                    disabled
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Integración con mapas en desarrollo</p>
                        </div>
    
                        {/* Sección Adjuntos */}
                        {attachments.length > 0 && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-3">
                                <FiPaperclip className="text-gray-500"/>
                                <h3 className="font-medium text-gray-700">Archivos Adjuntos</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {attachments.map((attachment) => (
                                    <AttachmentPreview
                                        key={attachment.id}
                                        attachment={attachment}
                                    />
                                ))}
                            </div>
                        </div>
)}
                    </div>
    
                    {/* Botones de Acción */}
                    <div className="sticky bottom-0 bg-transparent pt-4 border-t">
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-5 py-2 text-gray-800 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                            >
                                <FiSave className="inline-block" />
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="space-y-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Encabezado */}
                    <div className="pb-4 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Creada el {new Date(task.creationDate).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </p>
                    </div>
                        
                    {/* Contenido principal */}
                    <div className="space-y-6">
                        {/* Descripción */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-500 mb-2">Descripción</label>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {task.description || "No hay descripción disponible"}
                            </p>
                        </div>
                        
                        {/* Detalles principales en grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Fecha límite */}
                            <div className="bg-white p-4 rounded-lg border">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Fecha Límite</label>
                                <p className="text-gray-700">
                                    {new Date(task.dueDate).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>
                                
                            {/* Prioridad */}
                            <div className="bg-white p-4 rounded-lg border">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Prioridad</label>
                                <div className="flex items-center gap-2">
                                    <FaExclamationCircle className={`h-4 w-4 ${task.getPriorityColor()}`}/>
                                    <span className={`capitalize ${task.getPriorityColor()}`}>
                                        {task.priority}
                                    </span>
                                </div>
                            </div>
                                
                            {/* Estado */}
                            <div className="bg-white p-4 rounded-lg border">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Estado</label>
                                <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${task.complete ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="text-gray-700">{task.complete ? 'Completada' : 'Pendiente'}</span>
                                </div>
                            </div>
                        </div>
                                
                        {/* Ubicación */}
                        {task.location && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiMapPin className="text-blue-500"/>
                                    <h3 className="font-medium text-gray-700">Ubicación</h3>
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Latitud: {task.location.latitude}</p>
                                    <p>Longitud: {task.location.longitude}</p>
                                </div>
                            </div>
                        )}
                    
                        {/* Adjuntos */}
                        {task.attachments?.length > 0 && (
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <div className="flex items-center gap-2 mb-3">
                                    <FiPaperclip className="text-purple-600" />
                                    <h3 className="font-medium text-gray-700">Archivos Adjuntos</h3>
                                </div>

                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) => handleFileUpload(e.target.files)}
                                        id="file-upload-edit"
                                        className="hidden"
                                    />
                                    <label
                                        htmlFor="file-upload-edit"
                                        className="cursor-pointer block"
                                    >
                                        <p className="text-sm text-gray-600">
                                            {uploading ? 'Subiendo...' : 'Haz clic para agregar más archivos'}
                                        </p>
                                    </label>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    {attachments.map((attachment) => (
                                        <AttachmentPreview
                                            key={attachment.id}
                                            attachment={attachment}
                                            onDelete={isEditing ? handleDeleteAttachment : null}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskDetail;