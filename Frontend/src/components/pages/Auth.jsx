import { useState } from "react";
import Signup from "./Signup/Signup";
import Login from "./Login/Login";

const API_URL = "http://localhost:8000/api/v1/users";

export default function Auth() {
    const [user, setUser] = useState(null);
    const [mode, setMode] = useState("login");

    const handleLogout = async () => {
        await fetch(`${API_URL}`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    if (user) {
        return (
            <div className="max-w-md mx-auto mt-10 text-center p-6 bg-white shadow-lg rounded-lg">
                <p className="text-xl font-semibold mb-4">
                    Welcome, {user.full_name || user.email}!
                </p>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div>
            {mode === "signup" ? (
                <Signup onSuccess={setUser} />
            ) : (
                <Login onSuccess={setUser} />
            )}
            <div className="text-center mt-4">
                <button
                    onClick={() =>
                        setMode(mode === "signup" ? "login" : "signup")
                    }
                    className="text-blue-600 hover:underline ml-1"
                >
                    Switch to {mode === "signup" ? "Login" : "Sign Up"}
                </button>
            </div>
        </div>
    );
}
