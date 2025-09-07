import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const GET_API_URL = "http://localhost:8000/api/v1/users/me";
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Optionally: try to fetch user from backend on mount (using cookie)
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(GET_API_URL, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });
                setUser(res.data.data);
            } catch (err) {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
