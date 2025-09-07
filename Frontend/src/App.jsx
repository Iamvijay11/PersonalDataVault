import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import HomePage from "./components/pages/Dashboard/Homepage";
import LoginPage from "./components/pages/Login/Login";
import SignupPage from "./components/pages/Signup/Signup";
import DashboardPage from "./components/pages/Dashboard";
import ProfilePage from "./components/pages/profile/Profile";
import DocumentsPage from "./components/pages/DocumentsPage";
import PasswordsPage from "./components/pages/PasswordsPage";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="dashboard/profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="dashboard/documents"
                        element={
                            <ProtectedRoute>
                                <DocumentsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="dashboard/passwords"
                        element={
                            <ProtectedRoute>
                                <PasswordsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
