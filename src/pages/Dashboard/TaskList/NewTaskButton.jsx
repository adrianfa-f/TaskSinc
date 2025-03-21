import { FiPlus } from "react-icons/fi";

const NewTaskButton = ({onClick}) => {
    return (
        <button onClick={onClick} className="fixed bottom-4 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-20">
            <FiPlus className="h-6 w-6"/>
        </button>
    )
}

export default NewTaskButton;