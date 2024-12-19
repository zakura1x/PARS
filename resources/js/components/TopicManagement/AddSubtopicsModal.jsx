import React, { useState, useEffect } from "react";

const AddSubtopicsModal = ({
    showModal,
    handleCancel,
    handleSave,
    initialSubtopics,
}) => {
    const [subtopics, setSubtopics] = useState([""]);

    // Initialize subtopics with at least one input field
    useEffect(() => {
        setSubtopics(initialSubtopics && initialSubtopics.length > 0 ? initialSubtopics : [""]);
    }, [initialSubtopics]);

    // Handle adding a new subtopic
    const handleAddSubtopic = () => {
        setSubtopics([...subtopics, ""]);
    };

    // Handle subtopic input change
    const handleSubtopicChange = (index, value) => {
        const updatedSubtopics = [...subtopics];
        updatedSubtopics[index] = value;
        setSubtopics(updatedSubtopics);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[600px] max-w-full">
                <h2 className="text-xl font-bold mb-4">Add Subtopics</h2>

                <div className="h-[300px] overflow-y-auto pr-2">
                    {subtopics.map((subtopic, index) => (
                        <div key={index} className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                Subtopic {index + 1}
                            </label>
                            <input
                                type="text"
                                value={subtopic}
                                onChange={(e) =>
                                    handleSubtopicChange(index, e.target.value)
                                }
                                className="border border-gray-300 rounded w-full px-3 py-2"
                            />
                        </div>
                    ))}
                    <button
                        onClick={handleAddSubtopic}
                        className="text-sm text-blue-500 hover:underline mt-2"
                    >
                        + Add Subtopic
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={handleCancel}
                        className="btn border-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave(subtopics)}
                        className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubtopicsModal;
