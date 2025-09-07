import { useState, useEffect, useRef } from "react";
import { LogOut, Home, ChevronDown, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import AnimatedBackground from "../ReusableComponets/BackgroundAnimations";
import AppLogo from "../ReusableComponets/AppLogo";
import Footer from "../Footer/Footer";

const API_BASE_URL = "http://localhost:8000/api/v1";

const DashboardPage = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    // --- State Management ---
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // This effect processes the user data from the context
    useEffect(() => {
        // If the context is still loading, the user will be null.
        // If it has loaded and user is still null, then they are not authenticated.
        if (!user) {
            const timer = setTimeout(() => {
                // Double-check after a brief moment to ensure context had time to load
                if (!user) {
                    navigate("/login");
                }
            }, 500); // A small delay can prevent premature redirects
            return () => clearTimeout(timer);
        }

        // If the user object exists, create an enhanced profile for the UI
        const enhancedProfile = {
            ...user,
            fullName: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        };
        setUserProfile(enhancedProfile);
        setLoading(false); // Stop loading once the profile is set
    }, [user, navigate]);

    // --- UI Effects ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // --- Action Handlers ---
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_BASE_URL}/users/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        } catch (err) {
            console.error(
                "Backend logout failed, proceeding with client-side logout:",
                err
            );
        } finally {
            localStorage.removeItem("token");
            setUser(null);
            navigate("/login");
        }
    };

    const handleProfileClick = () => {
        setShowUserDropdown(false);
        navigate("/dashboard/profile");
    };

    // --- Conditional Render for Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
                <AnimatedBackground />
                <p className="relative z-10">Loading your secure vault...</p>
            </div>
        );
    }

    // --- Main JSX Render ---
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-x-hidden">
            <AnimatedBackground />

            {/* Navigation */}
            <nav className="relative z-40 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <AppLogo />
                    <div className="flex items-center space-x-4">
                        <button
                            className="px-4 py-2 text-white border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                            onClick={() => navigate("/dashboard")}
                        >
                            <Home className="w-5 h-5" />
                            <span className="hidden sm:inline">Home</span>
                        </button>
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() =>
                                    setShowUserDropdown(!showUserDropdown)
                                }
                                className="flex items-center space-x-2 px-4 py-2 text-white border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
                            >
                                <img
                                    src={
                                        userProfile?.profile_image_url ||
                                        `https://ui-avatars.com/api/?name=${
                                            userProfile?.fullName || "User"
                                        }&background=1e293b&color=cbd5e1`
                                    }
                                    alt="User Avatar"
                                    className="w-8 h-8 rounded-full object-cover border border-gray-500"
                                />
                                <span className="hidden md:inline">
                                    {userProfile?.fullName || "User"}
                                </span>
                                <ChevronDown
                                    size={18}
                                    className={`transition-transform duration-200 ${
                                        showUserDropdown ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                            {showUserDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-50 animate-fade-in-down">
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                                    >
                                        <UserIcon size={18} />
                                        <span>Profile</span>
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Dashboard Content */}
            <main className="relative z-30 max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
                        Welcome,{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                            {userProfile?.fullName || "Vault User"}!
                        </span>
                    </h1>
                    <p
                        className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Your digital life, secured and organized. Choose a
                        section below to manage your data.
                    </p>
                </div>

                {/* Documents Section - UPDATED */}
                <div
                    className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 mb-12 shadow-2xl animate-fade-in-up"
                    style={{ animationDelay: "0.4s" }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-white">
                            Your Documents
                        </h2>
                        <button
                            onClick={() => navigate("/dashboard/documents")}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center space-x-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <span>Manage Documents</span>
                        </button>
                    </div>
                    <p className="text-gray-400 text-center py-8">
                        Click "Manage Documents" to view, add, or delete your
                        secure files.
                    </p>
                </div>

                {/* Passwords Section - UPDATED */}
                <div
                    className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl animate-fade-in-up"
                    style={{ animationDelay: "0.6s" }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-white">
                            Your Passwords
                        </h2>
                        <button
                            onClick={() => navigate("/dashboard/passwords")}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full flex items-center space-x-2 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
                        >
                            <span>Manage Passwords</span>
                        </button>
                    </div>
                    <p className="text-gray-400 text-center py-8">
                        Click "Manage Passwords" to view, add, or delete your
                        saved credentials.
                    </p>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DashboardPage;
