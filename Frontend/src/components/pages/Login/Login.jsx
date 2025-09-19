import { useState } from "react";
import { Lock, Mail, ArrowRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import AnimatedBackground from "../../ReusableComponets/BackgroundAnimations";

const API_URL = "http://localhost:8000/api/v1/users";
const GOOGLE_API_URL = "http://localhost:8000/api/v1/auth/google";

axios.defaults.withCredentials = true;

const LoginPage = () => {
    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });

    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!formData.identifier || !formData.password) {
            console.error("Username/Email and password are required");
            return;
        }

        try {
            const res = await axios.post(
                `${API_URL}/login`,
                { userData: formData },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            setUser(res.data.data);

            console.log("Login Successful");
            navigate("/dashboard");
        } catch (error) {
            console.error(
                "Login error:",
                error.response.data.message || "Login failed"
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden flex items-center justify-center p-4">
            <AnimatedBackground />

            <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl animate-fade-in-up">
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-white text-center mb-6">
                    Welcome Back!
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="identifier"
                            className="block text-gray-300 text-sm font-medium mb-2"
                        >
                            Email/Username
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                id="identifier"
                                name="identifier"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                                placeholder="you@example.com"
                                value={formData.identifier}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-300 text-sm font-medium mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                                placeholder="enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="group w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-cyan-500/20 flex items-center justify-center space-x-2"
                    >
                        <span>Login Securely</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </form>

                <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative bg-white/10 px-4 text-sm text-gray-400">
                        OR
                    </div>
                </div>

                <button
                    onClick={() => {
                        window.location.href = GOOGLE_API_URL;
                    }}
                    className="group w-full flex items-center justify-center px-8 py-3 border border-gray-600 rounded-full text-white font-semibold hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 space-x-3"
                >
                    <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M22.44 12.24C22.44 11.484 22.368 10.728 22.224 10H12V14.4H17.808C17.52 16.128 16.512 17.508 15.012 18.426V21.6H19.26C21.72 19.332 23.004 16.032 23.004 12.24H22.44Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23.004C14.712 23.004 17.028 22.08 18.66 20.64L15.012 18.426C14.04 19.068 13.008 19.44 12 19.44C9.36 19.44 7.14 17.616 6.312 15.06H2.664V18.24C4.332 21.48 7.908 23.004 12 23.004Z"
                            fill="#34A853"
                        />
                        <path
                            d="M6.312 15.06C6.12 14.412 6 13.728 6 13C6 12.272 6.12 11.588 6.312 10.94H2.664V7.76C1.992 9.084 1.62 10.548 1.62 12C1.62 13.452 1.992 14.916 2.664 16.24L6.312 15.06Z"
                            fill="#FBBC04"
                        />
                        <path
                            d="M12 5.04C13.488 5.04 14.796 5.616 15.828 6.588L18.72 3.696C17.028 2.064 14.712 1.08 12 1.08C7.908 1.08 4.332 2.604 2.664 5.844L6.312 9.024C7.14 6.468 9.36 5.04 12 5.04Z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Continue with Google</span>
                </button>

                <p className="text-center text-gray-400 mt-6">
                    Don't have an account?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer transition-colors duration-300"
                    >
                        Sign Up
                    </span>
                </p>
                <p className="text-center text-gray-400 mt-2">
                    <span
                        onClick={() => navigate("/")}
                        className="text-gray-500 hover:text-gray-400 font-medium cursor-pointer transition-colors duration-300"
                    >
                        Back to Home
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
