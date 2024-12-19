import React, { useState } from "react";
import AddTopicsModal from "../../../components/TopicManagement/AddTopicsModal";

const TableDetails = () => {
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [tableData, setTableData] = useState([
        { topic: "Topic 1", subtopics: ["Subtopic 1.1", "Subtopic 1.2"] },
        { topic: "Topic 2", subtopics: ["Subtopic 2.1"] },
    ]);

    const handleOpenModal = () => {
        setShowModal(true); // Open the modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
    };

    const handleSave = (topics) => {
        setTableData(topics); // Save the topics to your table data
        setShowModal(false); // Close the modal after saving
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Master Topic Details</h1>

            {/* Master Topic Name and Subject (Horizontally Aligned) */}
            <div className="mb-6 flex space-x-4">
                <div className="flex-1">
                    <label className="block mb-2">Master Topic Name</label>
                    <input
                        type="text"
                        // value={masterTopicName}
                        className="border rounded p-2 w-full bg-gray-200"
                        disabled
                    />
                </div>

                <div className="flex-1">
                    <label className="block mb-2">Subject</label>
                    <input
                        type="text"
                        // value={subject}
                        className="border rounded p-2 w-full bg-gray-200"
                        disabled
                    />
                </div>
            </div>

            {/* Horizontal Line Below Both Fields */}
            <hr className="my-4 border-t-2 border-gray-400" />

            {/* Button to open the modal */}
            <button
                onClick={handleOpenModal}
                className="btn border-none bg-[#303030] text-white hover:bg-green-600"
            >
                Add Topic and Subtopics
            </button>

            {/* Table displaying topics and subtopics */}
            <table className="min-w-full border-collapse my-6">
                <thead>
                    <tr>
                        <th className="border-b px-4 py-2">Topic Name</th>
                        <th className="border-b px-4 py-2">Subtopics</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td className="border-b px-4 py-2">{row.topic}</td>
                            <td className="border-b px-4 py-2">
                                {row.subtopics.join(", ")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* AddTopicsModal Integration */}
            <AddTopicsModal
                showModal={showModal}
                handleCancel={handleCloseModal}
                handleSave={handleSave}
                data={tableData} // You can pass the existing data here if necessary
            />
        </div>
    );
};

export default TableDetails;
