import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    console.log("user in ProtectedRoute:", user);

    if (user === null) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
