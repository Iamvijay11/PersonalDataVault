import clientData from "./clientData";

export default function Client() {
    let totalCost = [
        "$",
        clientData.serviceCost[1] +
            clientData.plateformFee[1] +
            clientData.editorFee[1],
        ".00",
    ];

    return (
        <div className="bg-white p-8 rounded-xl shadow-md max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0e032f] mb-6 text-center">
                Project Summary
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Left: Project Details */}
                <div className="w-full md:w-1/2 bg-blue-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-[#0e032f] mb-4">
                        Project Details:
                    </h3>
                    <div className="space-y-3 text-gray-700">
                        <div className="space-y-3 text-gray-700">
                            <h3 className="text-black font-xlarge">
                                Description:
                            </h3>
                            <p className="text-gray-600 font-small">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Autem illum hic incidunt
                                itaque officia, nihil culpa! Molestiae, id
                                praesentium impedit quasi necessitatibus nihil
                                maxime, a, reprehenderit consequatur blanditiis
                                ullam omnis!
                            </p>
                        </div>
                        <div className="flex justify-between">
                            <span>Project Name</span>
                            <span>{clientData.projectName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Start Date</span>
                            <span>2025-06-01</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Deadline</span>
                            <span>2025-07-01</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className="text-green-600 font-medium">
                                Ongoing
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>Assigned Editor</span>
                            <span>{clientData.editorName}</span>
                        </div>
                    </div>
                </div>

                {/* Right: Payment Details */}
                <div className="w-full md:w-1/2">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold text-[#0e032f] mb-1">
                            Project Payment:
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Complete the payment to finalize the project.
                        </p>

                        <div className="space-y-4">
                            <div className="flex justify-between text-gray-700">
                                <span>Service Cost</span>
                                <span>{clientData.serviceCost}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Editor Fee</span>
                                <span>{clientData.editorFee}</span>
                            </div>
                            <div className="flex justify-between text-gray-700">
                                <span>Platform Fee</span>
                                <span>{clientData.plateformFee}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-[#0e032f] font-bold text-lg">
                                <span>Total Amount</span>
                                <span>{totalCost}</span>
                            </div>
                        </div>

                        <button className="mt-6 w-full bg-[#0e032f] text-white py-3 rounded-md font-medium hover:bg-[#09021b] flex justify-center items-center gap-2">
                            <span>💳</span> Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
