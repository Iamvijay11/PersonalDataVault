// App.jsx or Routes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";

function App() {
    const [user, setUser] = useState(null); // update this upon login

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login onSuccess={setUser} />} />
                <Route path="/signup" element={<Signup onSuccess={setUser} />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user}>
                            <Dashboard user={user} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
