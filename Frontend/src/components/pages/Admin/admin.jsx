import React, { useState } from "react";
import adminData from "./adminData";

export default function AdminPanel() {
    const [selectedUser, setSelectedUser] = useState("All Users");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [selectedType, setSelectedType] = useState("All Types");

    const filteredTransactions = adminData
        .filter((txn) =>
            selectedUser === "All Users" ? true : txn.user === selectedUser
        )
        .filter((txn) =>
            selectedStatus === "All Status"
                ? true
                : txn.status === selectedStatus
        )
        .filter((txn) =>
            selectedType === "All Types" ? true : txn.type === selectedType
        );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h2 className="text-2xl font-bold text-[#0e032f] mb-6">
                Transaction Management
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="date"
                    className="border border-gray-300 rounded-md px-4 py-2"
                />
                <select
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option>All Users</option>
                    <option>editor@example.com</option>
                    <option>client@example.com</option>
                    <option>admin</option>
                </select>
                <select
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Pending</option>
                </select>
                <select
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option>All Types</option>
                    <option>Payment</option>
                    <option>Withdrawal</option>
                    <option>Adjustment</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white shadow rounded-xl">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-blue-50 text-gray-700 font-semibold">
                        <tr>
                            <th className="px-6 py-3">USER</th>
                            <th className="px-6 py-3">DATE</th>
                            <th className="px-6 py-3">TYPE</th>
                            <th className="px-6 py-3">AMOUNT</th>
                            <th className="px-6 py-3">STATUS</th>
                            <th className="px-6 py-3">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td
                                    className="px-6 py-4 text-center text-gray-500"
                                    colSpan={6}
                                >
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((txn, idx) => (
                                <tr
                                    key={idx}
                                    className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="px-6 py-3">{txn.user}</td>
                                    <td className="px-6 py-3">{txn.date}</td>
                                    <td className="px-6 py-3">{txn.type}</td>
                                    <td className="px-6 py-3">{txn.amount}</td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                txn.status === "Completed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {txn.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3 space-x-3 text-lg text-gray-600">
                                        {/* Placeholder icons */}
                                        {txn.status === "Pending" && (
                                            <>
                                                <button title="Approve">
                                                    ✅
                                                </button>
                                                <button title="Reject">
                                                    ❌
                                                </button>
                                            </>
                                        )}
                                        <button title="View">$</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
