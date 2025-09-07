import { useState } from "react";
import Client from "./client/client";
import Editor from "./Freelancer/editor";
import AdminPanel from "./Admin/admin";

export default function PricingPage() {
    const [viewAs, setViewAs] = useState("Client");

    const renderView = () => {
        switch (viewAs) {
            case "Client":
                return <Client />;
            case "Editor":
                return <Editor />;
            case "Admin":
                return <AdminPanel />;
            default:
                return null;
        }
    };

    const buttonClass = (role) =>
        `px-4 py-1 rounded shadow mr-2 font-medium ${
            viewAs === role
                ? "bg-[#0e032f] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Top bar with search */}
            {/* <div className="flex justify-between items-center mt-6 mb-6 ml-6">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-1/4 px-4 py-2 rounded-md border border-gray-300 shadow-sm"
                />
            </div> */}

            {/* View as toggle buttons */}
            <div className="mt-6 mb-6 ml-6">
                <span className="font-medium mr-2">View As :</span>
                <button
                    className={buttonClass("Client")}
                    onClick={() => setViewAs("Client")}
                >
                    Client
                </button>
                <button
                    className={buttonClass("Editor")}
                    onClick={() => setViewAs("Editor")}
                >
                    Editor
                </button>
                <button
                    className={buttonClass("Admin")}
                    onClick={() => setViewAs("Admin")}
                >
                    Admin
                </button>
            </div>

            {/* Render respective view */}
            {renderView()}
        </div>
    );
}
