import React, { useState } from "react";

const AddTopicsModal = ({ showModal, handleCancel, handleSave, data }) => {
    const [topicName, setTopicName] = useState(""); // Single topic name input

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full">
                <h2 className="text-xl font-bold mb-4">Add Topic</h2>

                {/* Input for Topic */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Topic Name
                    </label>
                    <input
                        type="text"
                        value={topicName}
                        onChange={(e) => setTopicName(e.target.value)}
                        className="border border-gray-300 rounded w-full px-3 py-2"
                        placeholder="Enter topic name"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={handleCancel}
                        className="btn border-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave([{ name: topicName }])}
                        className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTopicsModal;
