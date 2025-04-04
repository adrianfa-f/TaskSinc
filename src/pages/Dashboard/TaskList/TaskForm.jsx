import { useState, useRef } from 'react';
import { FiX, FiCalendar, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import { Task } from '../../../models/Task';
import { createTask } from '../../../service/TaskService/TaskService';
import { useClickOutside } from '../../../Hooks/useClickOutside';
import AttachmentPreview from '../TaskDetails/AttachmentPreview';
import { AttachmentService } from '../../../service/AttachmentService';
import { Attachment } from '../../../models/Attachment';

const TaskForm = ({ onClose }) => {
    const { currentUser } = useAuth();
    const formRef = useRef();
    useClickOutside(formRef, onClose);
    const [uploading, setUploading] = useState(false);
    const [localAttachments, setLocalAttachments] = useState([]);
    
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
            const newAttachments = await Promise.all(
                Array.from(files).map(async (file) => {
                    const formData = new FormData();
                    formData.append("file", file);
                    
                    const response = await fetch(
                        `/.netlify/functions/upload?userId=${currentUser.uid}&type=temp`,
                        { method: "POST", body: formData }
                    );

                    const { publicUrl, mimeType } = await response.json();
                    return {
                        name: file.name,
                        blobUrl: publicUrl,
                        type: mimeType,
                        size: file.size,
                        taskId: null,
                        isTemp: true // Marcar como temporal
                    };
                })
            );

            setLocalAttachments([...localAttachments, ...newAttachments]);
        } finally {
            setUploading(false);
        }
    };
    
    // Función para eliminar adjuntos temporales
    const handleDeleteTempAttachment = async (attachment) => {
        try {
            const url = new URLSearchParams(attachment.blobUrl.split("?")[1]);
            const blobId = url.get("blobId");
            await fetch(
                `/.netlify/functions/delete?userId=${currentUser.uid}&type=attachments&blobId=${blobId}`,
                { method: "DELETE" }
            );
            
            setLocalAttachments(prev => prev.filter(a => a.blobUrl !== attachment.blobUrl));
        } catch (error) {
            console.error('Error eliminando archivo temporal:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            // Crear instancia del modelo Task
            const newTask = new Task({
                ...formData,
                dueDate: new Date(formData.dueDate).toISOString().split('T')[0]
            });

            // Llamar directamente al servicio
            const createdTask = await createTask(newTask.toFirestore(), currentUser.uid);

            if (localAttachments.length > 0) {

                const moveBlob = async (params) => {
                    const response = await fetch('/.netlify/functions/move', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(params)
                    });
                    
                    if (!response.ok) throw new Error('Error moving blob');
                    return await response.json();
                };

                await Promise.all(
                    localAttachments.map(async (attachment) => {
                        

                        const url = new URLSearchParams(attachment.blobUrl.split("?")[1]);
                        const blobId = url.get("blobId");

                      // Mover el blob a la ubicación definitiva
                        const { newBlobId } = await moveBlob({
                            userId: currentUser.uid,
                            oldType: 'temp',
                            newType: 'attachments',
                            blobId: blobId,
                            taskId: createdTask.id
                        });

                        // Crear registro en Firestore
                        const newAttachment = new Attachment({
                            name: attachment.name,
                            blobUrl: `/.netlify/functions/get?userId=${currentUser.uid}&type=attachments&blobId=${newBlobId}`,
                            type: attachment.type,
                            size: attachment.size,
                            taskId: createdTask.id,
                            userId: currentUser.uid
                        });

                        await AttachmentService.createAttachment(
                            newAttachment,
                            currentUser.uid,
                            createdTask.id
                        );
                    })
                );
            }

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
            <div ref={formRef} className="bg-gray-50 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-gray-100 max-h-[90vh]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800"> Nueva Tarea </h2>
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
                            <button type="button" onClick={() => setFormData({...formData, priority: "medium"})} className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 transition-all ${formData.priority === "medium" ? 'border-2 border-yellow-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
                                <span className={`text-sm font-medium ${formData.priority === "medium" ? 'text-yellow-700' : 'text-gray-600'}`}>
                                    Media
                                </span>
                            </button>
                            <button type="button" onClick={() => setFormData({...formData, priority: "high"})} className={`flex-1 p-2 rounded-md flex items-center justify-center space-x-2 transition-all ${formData.priority === "high" ? 'border-2 border-red-500 bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
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
                                onChange={(e) =>{
                                    e.preventDefault();
                                    handleFileUpload(e.target.files)}}
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
                            <div className="grid grid-cols-3 gap-2 mt-3">
                                {localAttachments.map((attachment, index) => (
                                    <AttachmentPreview
                                        key={index}
                                        attachment={attachment}
                                        onDelete={handleDeleteTempAttachment}
                                    />
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