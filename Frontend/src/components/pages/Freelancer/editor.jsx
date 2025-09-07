import { useState } from "react";
import rawTransactions from "./editorTransaction";

export default function Editor() {
    const [transactions, setTransactions] = useState(rawTransactions);
    const [totalEarned, setTotalEarned] = useState(() =>
        rawTransactions.reduce((sum, txn) => sum + txn.amount, 0)
    );
    const [withdrawn, setWithdrawn] = useState(false);

    const handleWithdraw = () => {
        if (totalEarned === 0 || withdrawn) return;

        const newTxn = {
            project: "Withdrawal",
            date: new Date().toISOString().split("T")[0],
            amount: -totalEarned,
        };

        setTransactions([...transactions, newTxn]);
        setTotalEarned(0);
        setWithdrawn(true); // prevent multiple withdrawals (optional)
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-[#0e032f] mb-6">
                Editor Panel
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Total Earnings + Withdraw */}
                <div className="flex flex-col w-full md:w-1/2 bg-purple-50 border border-purple-200 rounded-lg p-6 items-center justify-center text-center">
                    <h3 className="text-lg font-semibold text-[#0e032f] mb-2">
                        Total Earnings
                    </h3>
                    <p className="text-3xl font-bold text-[#0e032f] mb-4">
                        ${totalEarned.toFixed(2)}
                    </p>
                    <button
                        onClick={handleWithdraw}
                        disabled={totalEarned === 0 || withdrawn}
                        className={`px-6 py-2 rounded-md font-medium transition ${
                            totalEarned === 0 || withdrawn
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-[#0e032f] hover:bg-[#09021b] text-white"
                        }`}
                    >
                        Withdraw
                    </button>
                </div>

                {/* Transaction History */}
                <div className="w-full md:w-1/2">
                    <h3 className="text-xl font-bold text-[#0e032f] mb-3">
                        Transaction History
                    </h3>
                    <ul className="divide-y divide-gray-200">
                        {[...transactions].reverse().map((txn, idx) => (
                            <li
                                key={idx}
                                className="py-3 flex justify-between items-center"
                            >
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        {txn.project}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {txn.date}
                                    </p>
                                </div>
                                <p
                                    className={`text-sm font-semibold ${
                                        txn.amount >= 0
                                            ? "text-green-700"
                                            : "text-red-600"
                                    }`}
                                >
                                    {txn.amount >= 0 ? "+" : "-"}$
                                    {Math.abs(txn.amount).toFixed(2)}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
