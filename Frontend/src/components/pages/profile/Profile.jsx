import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import {
    User as UserIcon,
    Mail,
    Phone,
    Image as ImageIcon,
    Save,
    ArrowLeft,
} from "lucide-react";
import AnimatedBackground from "../../ReusableComponets/BackgroundAnimations";
import AppLogo from "../../ReusableComponets/AppLogo";
import Footer from "../../Footer/Footer";

// --- API Configuration ---
const API_BASE_URL = "http://localhost:8000/api/v1";

// Helper to create an authenticated axios instance
const createApiClient = () => {
    const token = localStorage.getItem("token");
    return axios.create({
        baseURL: API_BASE_URL,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // --- State Management ---
    const [userProfile, setUserProfile] = useState(null);
    const [editProfile, setEditProfile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAvatarFile, setSelectedAvatarFile] = useState(null);
    const [message, setMessage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // --- Effect to initialize state from context ---
    useEffect(() => {
        if (user) {
            const profileData = {
                first_name: user.first_name || "",
                last_name: user.last_name || "",
                username: user.username || "",
                email: user.email || "",
                phone: user.phone || "",
                profile_image_url:
                    user.profile_image_url ||
                    `https://ui-avatars.com/api/?name=${
                        user.first_name || "U"
                    }&background=1e293b&color=cbd5e1`,
            };
            setUserProfile(profileData);
            setEditProfile(profileData);
        } else {
            navigate("/login");
        }
    }, [user, navigate]);

    // --- Handlers ---
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedAvatarFile(file);
            setEditProfile((prev) => ({
                ...prev,
                profile_image_url: URL.createObjectURL(file),
            }));
        }
    };

    const handleSave = async () => {
        if (!user || !user.id) {
            setMessage({
                type: "error",
                text: "User ID is missing. Cannot update.",
            });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        const formData = new FormData();
        formData.append("first_name", editProfile.first_name);
        formData.append("last_name", editProfile.last_name);
        formData.append("username", editProfile.username); // Username is updatable
        formData.append("phone", editProfile.phone);
        // We DO NOT append the email, as it is not updatable

        if (selectedAvatarFile) {
            formData.append("profile_image_url", selectedAvatarFile);
        }

        try {
            const apiClient = createApiClient();
            const res = await apiClient.put(
                `/users/update/${user.id}`,
                formData
            );

            const updatedUser = res.data.data;

            setUser(updatedUser);
            setIsEditing(false);
            setSelectedAvatarFile(null);
            setMessage({
                type: "success",
                text: "Profile updated successfully!",
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ||
                    "Failed to update profile.",
            });
            setEditProfile(userProfile);
        } finally {
            setIsSaving(false);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    const handleCancel = () => {
        setEditProfile(userProfile);
        setIsEditing(false);
        setSelectedAvatarFile(null);
        setMessage(null);
    };

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                <AnimatedBackground />
                <p>Loading Profile...</p>
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

            <section className="relative z-30 max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-white text-center mb-8">
                        User Profile
                    </h1>

                    {message && (
                        <div
                            className={`p-3 rounded-md mb-6 text-center ${
                                message.type === "success"
                                    ? "bg-green-500/20 text-green-300"
                                    : "bg-red-500/20 text-red-300"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={editProfile.profile_image_url}
                            alt="Profile Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-lg mb-4"
                        />
                        <h2 className="text-3xl font-semibold text-white">
                            {userProfile.first_name} {userProfile.last_name}
                        </h2>
                        <p className="text-gray-400">{userProfile.email}</p>
                    </div>

                    <form
                        className="space-y-6"
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* First Name */}
                            <div>
                                <label
                                    htmlFor="first_name"
                                    className="block text-gray-300 text-sm font-medium mb-2"
                                >
                                    First Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        value={editProfile.first_name}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-70"
                                    />
                                </div>
                            </div>
                            {/* Last Name */}
                            <div>
                                <label
                                    htmlFor="last_name"
                                    className="block text-gray-300 text-sm font-medium mb-2"
                                >
                                    Last Name
                                </label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        id="last_name"
                                        name="last_name"
                                        value={editProfile.last_name}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-70"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email (Non-Editable) */}
                        <div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-gray-300 text-sm font-medium mb-2"
                                >
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={editProfile.email}
                                        readOnly // This field is always read-only
                                        className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-70 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <label
                                htmlFor="username"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={editProfile.username}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-70"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-gray-300 text-sm font-medium mb-2"
                            >
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={editProfile.phone}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300 disabled:opacity-70"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div>
                                <label
                                    htmlFor="avatar"
                                    className="block text-gray-300 text-sm font-medium mb-2"
                                >
                                    Profile Picture
                                </label>
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="file"
                                        id="avatar"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            document
                                                .getElementById("avatar")
                                                .click()
                                        }
                                        className="px-4 py-2 bg-gray-700 text-white rounded-md flex items-center space-x-2 hover:bg-gray-600 transition-colors"
                                    >
                                        <ImageIcon size={20} />
                                        <span>Choose Image</span>
                                    </button>
                                    {selectedAvatarFile && (
                                        <span className="text-gray-400 text-sm truncate max-w-[calc(100%-150px)]">
                                            {selectedAvatarFile.name}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-4">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20 flex items-center space-x-2"
                                >
                                    <span>Edit Profile</span>
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="px-6 py-3 text-gray-300 border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/20 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={20} />
                                        <span>
                                            {isSaving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default ProfilePage;
