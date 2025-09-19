import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
    ArrowLeft,
    UploadCloud,
    Plus,
    Trash2,
    FileText,
    FileType2,
    Download,
    Eye,
} from "lucide-react";
import AnimatedBackground from "../ReusableComponets/BackgroundAnimations";
import AppLogo from "../ReusableComponets/AppLogo";
import Footer from "../Footer/Footer";
import Modal from "../Modal/Modal";

const API_BASE_URL = "http://localhost:8000/api/v1";

const createApiClient = () => {
    return axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
    });
};

const DocumentsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [documents, setDocuments] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Modals and Forms ---
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [newDocument, setNewDocument] = useState({
        name: "",
        category: "",
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [downloadingId, setDownloadingId] = useState(null);

    useEffect(() => {
        if (authLoading) return; // wait for session restore

        if (!user) {
            navigate("/login");
            return;
        }

        const fetchDocuments = async () => {
            try {
                const apiClient = createApiClient();
                const res = await apiClient.get("/users/documents/get");
                setDocuments(res.data.data || []);
            } catch (err) {
                console.error("Failed to fetch documents:", err);
                setError(
                    "Could not load your documents. Please try again later."
                );
            } finally {
                setPageLoading(false);
            }
        };

        fetchDocuments();
    }, [user, authLoading, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setNewDocument((prev) => ({ ...prev, name: file.name }));
        }
    };

    const resetAddModal = () => {
        setShowAddModal(false);
        setSelectedFile(null);
        setNewDocument({ name: "", category: "" });
        setIsUploading(false);
    };

    const handleAddDocument = async () => {
        if (!selectedFile || !newDocument.name || !newDocument.category) {
            alert("Please select a file and fill out all fields.");
            return;
        }
        setIsUploading(true);

        const formData = new FormData();
        formData.append("documents", selectedFile);
        formData.append("filename", newDocument.name);
        formData.append("category", newDocument.category);
        formData.append("file_type", selectedFile.type);

        try {
            const apiClient = createApiClient();
            const res = await apiClient.post(
                "/users/documents/upload-document",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setDocuments((prev) => [...prev, res.data.data]);
            resetAddModal();
        } catch (err) {
            console.error("Failed to upload document:", err);
            alert(
                err.response?.data?.message || "Could not upload document."
            );
            setIsUploading(false);
        }
    };

    const openDeleteModal = (doc) => {
        setItemToDelete(doc);
        setShowDeleteModal(true);
    };

    const handleDeleteDocument = async () => {
        if (!itemToDelete) return;
        try {
            const apiClient = createApiClient();
            await apiClient.delete(`/users/documents/${itemToDelete.id}`);
            setDocuments((prev) =>
                prev.filter((doc) => doc.id !== itemToDelete.id)
            );
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (err) {
            console.error("Failed to delete document:", err);
            alert(
                err.response?.data?.message || "Could not delete document."
            );
        }
    };

    const handleDownload = (doc) => {
        const link = document.createElement("a");
        link.href = doc.file_url;
        link.download = doc.filename || "document";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Drag and Drop Handlers ---
    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
            setSelectedFile(file);
            setNewDocument({ name: file.name, category: "" });
            setShowAddModal(true);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <AnimatedBackground />
                <p>Loading Documents...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
            <AnimatedBackground />
            <nav className="relative z-40 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <AppLogo />
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-4 py-2 text-white border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </nav>

            <main className="relative z-30 max-w-7xl mx-auto px-6 py-12">
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`bg-white/10 backdrop-blur-md rounded-2xl border-2 p-8 shadow-2xl transition-all duration-300 ${
                        isDragging
                            ? "border-cyan-500 border-dashed"
                            : "border-white/20"
                    }`}
                >
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Your Documents
                        </h1>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center space-x-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus size={20} />
                            <span>Add New Document</span>
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 text-center mb-4">
                            {error}
                        </p>
                    )}

                    {documents.length === 0 && !error ? (
                        <div className="text-center py-16">
                            <UploadCloud className="mx-auto h-16 w-16 text-gray-500" />
                            <p className="mt-4 text-gray-400">
                                You haven't uploaded any documents yet.
                            </p>
                            <p className="text-sm text-gray-500">
                                Drag and drop a file here or click "Add New
                                Document".
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => {
                                const isImage =
                                    doc.file_type &&
                                    doc.file_type.startsWith("image/");
                                const isPdf =
                                    doc.file_type &&
                                    doc.file_type === "application/pdf";
                                const isWord =
                                    doc.file_type &&
                                    (doc.file_type ===
                                        "application/msword" ||
                                        doc.file_type ===
                                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

                                return (
                                    <div
                                        key={doc.id}
                                        draggable={isImage}
                                        onDragStart={(e) => {
                                            if (isImage) {
                                                const mimeType =
                                                    doc.file_type ||
                                                    "application/octet-stream";
                                                const downloadData = `${mimeType}:${doc.filename}:${doc.file_url}`;
                                                e.dataTransfer.setData(
                                                    "DownloadURL",
                                                    downloadData
                                                );
                                                e.dataTransfer.setData(
                                                    "text/uri-list",
                                                    doc.file_url
                                                );
                                                e.dataTransfer.setData(
                                                    "text/plain",
                                                    doc.file_url
                                                );
                                            } else {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex flex-col justify-between ${
                                            isImage
                                                ? "cursor-grab active:cursor-grabbing"
                                                : "cursor-default"
                                        }`}
                                    >
                                        <div className="w-full h-40 bg-black/20 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                                            {isImage ? (
                                                <img
                                                    src={doc.file_url}
                                                    alt={doc.filename}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : isPdf ? (
                                                <iframe
                                                    src={`${doc.file_url}#toolbar=0`}
                                                    title={doc.filename}
                                                    className="w-full h-full border-0"
                                                />
                                            ) : isWord ? (
                                                <FileType2
                                                    size={48}
                                                    className="text-blue-400"
                                                />
                                            ) : (
                                                <FileText
                                                    size={48}
                                                    className="text-gray-500"
                                                />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium break-words whitespace-normal">
                                                {doc.filename}
                                            </p>
                                            <p className="text-gray-400 text-sm">
                                                Category: {doc.category}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-end space-x-4 mt-4">
                                            <a
                                                href={doc.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-300 hover:text-cyan-400 transition-colors flex items-center space-x-1"
                                            >
                                                <Eye size={16} />
                                                <span>View</span>
                                            </a>
                                            <button
                                                onClick={() =>
                                                    handleDownload(doc)
                                                }
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                <Download size={16} />
                                                <span>
                                                    {downloadingId ===
                                                    doc.filename
                                                        ? "..."
                                                        : "Download"}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() =>
                                                    openDeleteModal(doc)
                                                }
                                                className="text-red-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {showAddModal && (
                <Modal
                    title="Add New Document"
                    onClose={resetAddModal}
                    onSubmit={handleAddDocument}
                    submitText={isUploading ? "Uploading..." : "Upload"}
                >
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="file"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Select File{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            {selectedFile ? (
                                <p className="text-gray-300 bg-white/10 p-2 rounded-md">
                                    {selectedFile.name}
                                </p>
                            ) : (
                                <input
                                    type="file"
                                    id="file"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-300 hover:file:bg-cyan-500/20"
                                    required
                                />
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Document Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={newDocument.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="e.g., Passport Scan"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="category"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Category{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="category"
                                value={newDocument.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="e.g., Identity, Financial, etc."
                                required
                            />
                        </div>
                    </div>
                </Modal>
            )}

            {showDeleteModal && (
                <Modal
                    title="Confirm Deletion"
                    onClose={() => setShowDeleteModal(false)}
                    onSubmit={handleDeleteDocument}
                    submitText="Delete"
                >
                    <p className="text-gray-300">
                        Are you sure you want to delete the document{" "}
                        <strong className="font-medium text-white">
                            {itemToDelete?.filename}
                        </strong>
                        ? This action cannot be undone.
                    </p>
                </Modal>
            )}

            <Footer />
        </div>
    );
};

export default DocumentsPage;
