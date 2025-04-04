import { FiFile, FiImage, FiVideo, FiMusic, FiX, FiDownload } from 'react-icons/fi';

const AttachmentPreview = ({ attachment, onDelete }) => {
    if (!attachment || !attachment.type) {
        console.error('Invalid attachment:', attachment);
        return <div>Archivo inválido</div>; 
    }

    const fileType = attachment.type.split('/')[0] || 'unknown';
    const isImage = fileType === 'image';

    const getIcon = () => {
        switch(fileType) {
            case 'image': return <FiImage className="text-2xl text-blue-500"/>;
            case 'video': return <FiVideo className="text-2xl text-red-500"/>;
            case 'audio': return <FiMusic className="text-2xl text-green-500"/>;
            default: return <FiFile className="text-2xl text-gray-500"/>;
        }
    };

    return (
        <div className="group relative border rounded-lg p-2 hover:bg-gray-50 transition-colors">
            <div className="flex flex-col items-center">
                {isImage ? (
                    <img 
                        src={attachment.blobUrl} 
                        alt={attachment.name}
                        className="h-20 w-full object-cover rounded-md"
                        loading="lazy"
                        onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = 'placeholder-image.svg';}}
                    />
                ) : (
                    <div className="h-20 w-full flex items-center justify-center">
                        {getIcon()}
                    </div>
                )}

                <span className="text-xs text-center mt-1 truncate w-full px-1">
                    {attachment.name}
                </span>
            </div>
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                <a
                    href={attachment.blobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300"
                    download
                >
                    <FiDownload className="text-xl"/>
                </a>
                
                {onDelete && (
                    <button 
                        onClick={() => onDelete(attachment)}
                        className="text-red-300 hover:text-red-400"
                    >
                        <FiX className="text-xl"/>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AttachmentPreview;