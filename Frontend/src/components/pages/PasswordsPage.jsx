import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import {
    ArrowLeft,
    Plus,
    Trash2,
    Eye,
    EyeOff,
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

const PasswordsPage = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modals & forms
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] =
        useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [newPassword, setNewPassword] = useState({
        title: "",
        website: "",
        username: "",
        password: "",
    });

    // Reveal modal
    const [showRevealModal, setShowRevealModal] =
        useState(false);
    const [revealEmail, setRevealEmail] = useState("");
    const [revealTargetId, setRevealTargetId] =
        useState(null);
    const [revealLoading, setRevealLoading] =
        useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchPasswords = async () => {
            try {
                const api = createApiClient();
                const res = await api.get("/passwords");
                // Map fields and NEVER include password until revealed
                const items = (res.data?.data || []).map(
                    (row) => ({
                        id: row.id,
                        title: row.title || "Untitled",
                        website: row.website_url || "",
                        username: row.email_or_username,
                        // password fetched only via reveal endpoint
                        password: "",
                        show: false,
                    })
                );
                setPasswords(items);
            } catch (err) {
                console.error(
                    "Failed to fetch passwords:",
                    err
                );
                setError(
                    "Could not load your passwords. Please try again later."
                );
            } finally {
                setPageLoading(false);
            }
        };

        fetchPasswords();
    }, [user, authLoading, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPassword((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddPassword = async () => {
        if (
            !newPassword.title ||
            !newPassword.username ||
            !newPassword.password
        ) {
            alert(
                "Title, Username/Email and Password are required."
            );
            return;
        }
        try {
            const api = createApiClient();
            const res = await api.post("/passwords/add", {
                title: newPassword.title,
                website: newPassword.website || null,
                username: newPassword.username,
                password: newPassword.password,
            });
            const added = res.data?.data;
            const addedPassword = {
                id: added.id,
                title: added.title,
                website: added.website_url || "",
                username: added.email_or_username,
                password: "",
                show: false,
            };
            setPasswords((prev) => [
                addedPassword,
                ...prev,
            ]);
            setShowAddModal(false);
            setNewPassword({
                title: "",
                website: "",
                username: "",
                password: "",
            });
        } catch (err) {
            console.error("Failed to add password:", err);
            alert(
                err.response?.data?.message ||
                    "Could not save password."
            );
        }
    };

    const openDeleteModal = (password) => {
        setItemToDelete(password);
        setShowDeleteModal(true);
    };

    const handleDeletePassword = async () => {
        if (!itemToDelete) return;
        try {
            const api = createApiClient();
            await api.delete(
                `/passwords/delete/${itemToDelete.id}`
            );
            setPasswords((prev) =>
                prev.filter(
                    (pw) => pw.id !== itemToDelete.id
                )
            );
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (err) {
            console.error(
                "Failed to delete password:",
                err
            );
            alert(
                err.response?.data?.message ||
                    "Could not delete password."
            );
        }
    };

    const togglePasswordVisibility = (pw) => {
        if (pw.show) {
            // hide again, do not keep plaintext
            setPasswords((prev) =>
                prev.map((x) =>
                    x.id === pw.id
                        ? {
                              ...x,
                              show: false,
                              password: "",
                          }
                        : x
                )
            );
            return;
        }
        // open reveal modal
        setRevealTargetId(pw.id);
        setRevealEmail("");
        setShowRevealModal(true);
    };

    const handleRevealSubmit = async () => {
        if (!revealEmail) {
            alert("Please enter your email to verify.");
            return;
        }
        // Optional client-side check to reduce calls
        if (user?.email && revealEmail !== user.email) {
            alert(
                "Entered email does not match your logged-in email."
            );
            return;
        }
        try {
            setRevealLoading(true);
            const api = createApiClient();
            const res = await api.post(
                `/passwords/reveal/${revealTargetId}`,
                { email: revealEmail }
            );
            const plaintext =
                res.data?.data?.password || "";
            setPasswords((prev) =>
                prev.map((x) =>
                    x.id === revealTargetId
                        ? {
                              ...x,
                              password: plaintext,
                              show: true,
                          }
                        : x
                )
            );
            setShowRevealModal(false);
        } catch (err) {
            console.error(
                "Failed to reveal password:",
                err
            );
            alert(
                err.response?.data?.message ||
                    "Email verification failed."
            );
        } finally {
            setRevealLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <AnimatedBackground />
                <p>Loading Passwords...</p>
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
                        onClick={() =>
                            navigate("/dashboard")
                        }
                        className="px-4 py-2 text-white border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Dashboard</span>
                    </button>
                </div>
            </nav>

            <main className="relative z-30 max-w-7xl mx-auto px-6 py-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-white">
                            Your Passwords
                        </h1>
                        <button
                            onClick={() =>
                                setShowAddModal(true)
                            }
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center space-x-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <Plus size={20} />
                            <span>Add New Password</span>
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 text-center mb-4">
                            {error}
                        </p>
                    )}

                    {passwords.length === 0 && !error ? (
                        <p className="text-gray-400 text-center py-16">
                            You haven't saved any passwords
                            yet.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {passwords.map((pw) => (
                                <div
                                    key={pw.id}
                                    className="bg-gray-700/30 rounded-lg p-4 border border-gray-600 flex flex-col"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-white font-medium text-lg break-words flex-1 mr-2">
                                            {pw.title}
                                        </h3>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(
                                                    pw
                                                )
                                            }
                                            className="text-red-400 hover:text-red-500"
                                        >
                                            <Trash2
                                                size={20}
                                            />
                                        </button>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-1 break-words">
                                        Website:{" "}
                                        {pw.website || "-"}
                                    </p>
                                    <p className="text-gray-300 text-sm mb-2 break-words">
                                        Username:{" "}
                                        {pw.username}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-2">
                                        <p className="text-gray-300 text-sm break-all">
                                            Password:{" "}
                                            {pw.show
                                                ? pw.password
                                                : "••••••••"}
                                        </p>
                                        <button
                                            onClick={() =>
                                                togglePasswordVisibility(
                                                    pw
                                                )
                                            }
                                            className="text-gray-400 hover:text-white"
                                        >
                                            {pw.show ? (
                                                <EyeOff
                                                    size={
                                                        18
                                                    }
                                                />
                                            ) : (
                                                <Eye
                                                    size={
                                                        18
                                                    }
                                                />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Add Password Modal */}
            {showAddModal && (
                <Modal
                    title="Add New Password"
                    onClose={() => setShowAddModal(false)}
                    onSubmit={handleAddPassword}
                    submitText="Save"
                >
                    <div className="space-y-4">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newPassword.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="e.g., Google"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="website"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Website URL
                            </label>
                            <input
                                type="text"
                                name="website"
                                value={newPassword.website}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="e.g., https://accounts.google.com"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Username/Email
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={newPassword.username}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="e.g., your_email@gmail.com"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={newPassword.password}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                </Modal>
            )}

            {/* Reveal Modal */}
            {showRevealModal && (
                <Modal
                    title="Verify Email to Reveal Password"
                    onClose={() =>
                        setShowRevealModal(false)
                    }
                    onSubmit={handleRevealSubmit}
                    submitText={
                        revealLoading
                            ? "Verifying..."
                            : "Reveal"
                    }
                >
                    <div className="space-y-4">
                        <p className="text-gray-300 text-sm">
                            Enter your logged-in email to
                            confirm your identity:
                        </p>
                        <input
                            type="email"
                            value={revealEmail}
                            onChange={(e) =>
                                setRevealEmail(
                                    e.target.value
                                )
                            }
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="your_email@example.com"
                            required
                        />
                    </div>
                </Modal>
            )}

            {/* Confirm Delete Modal */}
            {showDeleteModal && (
                <Modal
                    title="Confirm Deletion"
                    onClose={() =>
                        setShowDeleteModal(false)
                    }
                    onSubmit={handleDeletePassword}
                    submitText="Delete"
                >
                    <p className="text-gray-300">
                        Are you sure you want to delete the
                        password entry{" "}
                        <strong className="font-medium text-white">
                            {itemToDelete?.title}
                        </strong>
                        ? This action cannot be undone.
                    </p>
                </Modal>
            )}

            <Footer />
        </div>
    );
};

export default PasswordsPage;
