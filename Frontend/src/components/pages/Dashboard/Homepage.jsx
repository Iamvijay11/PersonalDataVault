import { useState } from "react";
import { Eye, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../../ReusableComponets/BackgroundAnimations"; // Import new AnimatedBackground
import AppLogo from "../../ReusableComponets/AppLogo"; // Import new AppLogo

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
            {/* Background Animation */}
            <AnimatedBackground /> {/* Replaced entire background block */}
            {/* Navigation */}
            <nav className="relative z-40 p-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <AppLogo /> {/* Replaced logo and text */}
                    <div className="flex items-center space-x-4">
                        <button
                            className="px-6 py-3 text-white border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105"
                            onClick={() => {
                                navigate("/login");
                            }}
                        >
                            Login
                        </button>
                        <button
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                            onClick={() => {
                                navigate("/signup");
                            }}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <section className="relative z-30 max-w-7xl mx-auto px-6 py-20">
                <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
                        Secure Your
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent block">
                            Digital Life
                        </span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Your personal data deserves military-grade protection.
                        Store, manage, and control your digital identity with
                        our advanced encryption vault.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-cyan-500/20 flex items-center space-x-2">
                            <span>Get Started Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                        <button className="px-8 py-4 text-white border-2 border-gray-600 rounded-full hover:bg-gray-800 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                            <Eye className="w-5 h-5" />
                            <span>Watch Demo</span>
                        </button>
                    </div>
                </div>
            </section>
            {/* Footer */}
            <footer className="relative z-30 border-t border-white/10 mt-20">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="text-center text-gray-400">
                        <p>
                            &copy; 2025 Personal Data Vault. All rights
                            reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
