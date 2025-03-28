import { useState, useRef } from 'react';
import { FiX, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { Task } from '../../../models/Task';
import { createTask } from '../../../service/TaskService/TaskService';
import { useClickOutside } from '../../../Hooks/useClickOutside';

const TaskForm = ({ onClose }) => {
    const { currentUser } = useAuth();
    const formRef = useRef();
    useClickOutside(formRef, onClose);
    const [attachments, setAttachments] = useState([]);
    const [uploading, setUploading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        description: 'Sin descripción',
        dueDate: new Date().toISOString().split("T")[0],
        priority: 'medium',
        attachments: [],
        location: null
    });

    const validateForm = () => {
        if (!formData.title.trim() || !formData.dueDate) {
            alert('Título y Fecha límite son obligatorios');
            return false;
        }
        
        try {
            new Date(formData.dueDate).toISOString();
            return true;
        } catch (error) {
            alert('Fecha inválida');
            return false;
        }
    };

    const handleFileUpload = async (files) => {
        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(async    (file) => {
                const formData = new FormData();
                formData.append("file", file);
                
                const response = await fetch(
                    `/.netlify/functions/blobs/upload?userId=${currentUser.uid}&type=attachments`,
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const { publicUrl } = await response.json();
                return {
                    name: file.name,
                    url: publicUrl,
                    type: file.type.split('/')[0]
                };
            });

            const newAttachments = await Promise.all(uploadPromises);
            setAttachments([...attachments, ...newAttachments]);

        } finally {
            setUploading(false);
        }
    };

    const handleDeleteAttachment = async (attachmentUrl) => {
        try {
            const [,, userId, type, blobId] = attachmentUrl.split(/[:/]/);
            
            await fetch(
                `/api/blobs/delete?userId=${userId}&type=${type}&blobId=${blobId}`,
                { method: "DELETE" }
            );

            setAttachments(attachments.filter(a => a.url !== attachmentUrl));
        } catch (error) {
            console.error("Error eliminando archivo:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // Crear instancia del modelo Task
            const newTask = new Task({
                ...formData, attachments,
                dueDate: new Date(formData.dueDate).toISOString().split('T')[0]
            });

            // Llamar directamente al servicio
            await createTask(newTask.toFirestore(), currentUser.uid);

            onClose();
        } catch (error) {
            console.error("Error creando tarea:", error);
        }
    };

    // Estilos mejorados
    const inputStyle = "w-full mt-2 p-2 rounded-lg border border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all";
    const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div ref={formRef} className="bg-gray-50 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">➕ Nueva Tarea</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FiX className="h-7 w-7" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Sección horizontal para título y fecha */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className={labelStyle}>Título *</label>
                            <input type="text" required className={`${inputStyle}`} value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Nombre de la tarea"/>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border">
                            <label className={labelStyle}>
                                <FiCalendar className="inline mr-2 -mt-1" />
                                Fecha límite *
                            </label>
                            <input type="date" required className={`${inputStyle} [&::-webkit-calendar-picker-indicator]:bg-blue-500/20`} min={new Date().toISOString().split('T')[0]} value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})}/>
                        </div>
                    </div>

                    {/* Prioridad con nuevo diseño */}
                    <div className="bg-white p-4 rounded-xl border">
                        <label className={labelStyle}>📌 Nivel de Prioridad</label>
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <button type="button" onClick={() => setFormData({...formData, priority:"low"})} className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 transition-all ${formData.priority === "low" ? 'border-2 border-green-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                <span className={`text-sm font-medium ${formData.priority === "low" ? 'text-green-700' : 'text-gray-600'}`}>
                                    Baja
                                </span>
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, priority: "medium"})} className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 transition-all ${formData.priority === "medium" ? 'border-2 border-yellow-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} $ {new Task({priority: level}).getPriorityColor()}`}>
                                <span className={`text-sm font-medium ${formData.priority === "medium" ? 'text-yellow-700' : 'text-gray-600'}`}>
                                    Media
                                </span>
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, priority: "high"})} className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 transition-all ${formData.priority === "high" ? 'border-2 border-red-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'} $ {new Task({priority: level}).getPriorityColor()}`}>
                                <span className={`text-sm font-medium ${formData.priority === "high" ? 'text-red-700' : 'text-gray-600'}`}>
                                    Alta
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className={labelStyle}>📝 Descripción</label>
                        <textarea
                            rows="3"
                            className={`${inputStyle} resize-none`}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Detalles importantes de la tarea..."
                        />
                    </div>

                    {/* Sección horizontal para adjuntos y ubicación */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-6">
                            <label className="block text-sm   font-medium mb-2">
                                Archivos Adjuntos
                            </label>

                            {/* Input oculto para seleccionar     archivos */}
                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileUpload(e.target.files)}
                                id="file-upload"
                                className="hidden"
                            />

                            {/* Botón para activar el input */}
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer inline-block px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600"
                            >
                                {uploading ? 'Subiendo...' : 'Seleccionar Archivos'}
                            </label>

                            {/* Lista de archivos subidos */}
                            <div className="mt-3 space-y-2">
                                {attachments.map((attachment, index)    => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                        <span className="truncate">   {attachment.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAttachment(attachment.url)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FiX className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className={labelStyle}>
                                <FiMapPin className="inline mr-2 -mt-1" />
                                Ubicación
                            </label>
                            <input
                                type="text"
                                className={inputStyle}
                                placeholder="Oficina principal"
                                value={formData.location || ''}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Botón de enviar */}
                    <button
                        type="submit"
                        className="w-full  bg-blue-500 text-white py-3.5 rounded-lg font-medium  hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        🚀 Crear Tarea
                    </button>

                </form>
            </div>
        </div>
    );
};

export default TaskForm;