import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useMemo,
} from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://localhost:8000/api/v1/users/me";

const AuthContext = createContext(null);

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUserSession = async () => {
            try {
                const response = await axios.get(API_URL);

                if (response.data && response.data.data) {
                    setUser(response.data.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.log("No active session found or session expired.");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        verifyUserSession();
    }, []);

    const value = useMemo(
        () => ({
            user,
            setUser,
            loading,
            isAuthenticated: !!user,
        }),
        [user, loading]
    );

    // ✅ Don’t render the rest of the app until session check completes
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                Checking session...
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create a custom hook for easy consumption
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
