// Dummy transaction data
const adminData = [
    {
        user: "editor@example.com",
        date: "2023-10-25",
        type: "Withdrawal",
        amount: "$200.00",
        status: "Pending",
    },
    {
        user: "client@example.com",
        date: "2023-10-25",
        type: "Payment",
        amount: "$1120.00",
        status: "Completed",
    },
    {
        user: "admin",
        date: "2023-10-24",
        type: "Adjustment",
        amount: "-$10.00",
        status: "Completed",
    },
];

export default adminData;