import { X } from "lucide-react"; // THE FIX: Import the 'X' icon

const Modal = ({
    title,
    children,
    onClose,
    onSubmit,
    showCancel = true,
    submitText = "Save",
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md shadow-lg animate-fade-in-up">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={24} /> {/* This will now render correctly */}
                    </button>
                </div>
                {children}
                <div className="mt-6 flex justify-end space-x-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 border border-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    {onSubmit && (
                        <button
                            onClick={onSubmit}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-md hover:from-cyan-600 hover:to-blue-600 transition-colors"
                        >
                            {submitText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
