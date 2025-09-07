import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AppLogo = () => {
    const navigate = useNavigate();
    return (
        <div
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => navigate("/dashboard")}
        >
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
                <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                Personal Data Vault
            </span>
        </div>
    );
};

export default AppLogo;
