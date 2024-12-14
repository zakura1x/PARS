import React, { useState } from "react";

const AddTopicsModal = ({ showModal, handleCancel, handleSave, data }) => {
    const [topics, setTopics] = useState([{ name: "", subtopics: [""] }]);

    // Add a new topic
    const handleAddTopic = () => {
        setTopics([...topics, { name: "", subtopics: [""] }]);
    };

    // Update topic name
    const handleTopicChange = (index, value) => {
        const updatedTopics = [...topics];
        updatedTopics[index].name = value;
        setTopics(updatedTopics);
    };

    // Add a subtopic to a specific topic
    const handleAddSubtopic = (index) => {
        const updatedTopics = [...topics];
        updatedTopics[index].subtopics.push("");
        setTopics(updatedTopics);
    };

    // Update a specific subtopic
    const handleSubtopicChange = (topicIndex, subtopicIndex, value) => {
        const updatedTopics = [...topics];
        updatedTopics[topicIndex].subtopics[subtopicIndex] = value;
        setTopics(updatedTopics);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[800px] max-w-full">
                <h2 className="text-xl font-bold mb-4">Add Topics and Subtopics</h2>

                {/* DYNAMIC TOPICS AND SUBTOPICS */}
                <div className="h-[400px] overflow-y-auto pr-2">
                    {topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="mb-6">
                            {/* Topic Input */}
                            <div className="mb-2">
                                <label className="block text-sm font-medium mb-2">Topic {topicIndex + 1}</label>
                                <input
                                    type="text"
                                    value={topic.name}
                                    onChange={(e) => handleTopicChange(topicIndex, e.target.value)}
                                    className="border border-gray-300 rounded w-full px-3 py-2"
                                />
                            </div>

                            {/* Subtopics */}
                            <div>
                                {topic.subtopics.map((subtopic, subtopicIndex) => (
                                    <div key={subtopicIndex} className="flex items-center mb-2">
                                        <textarea
                                            value={subtopic}
                                            onChange={(e) =>
                                                handleSubtopicChange(topicIndex, subtopicIndex, e.target.value)
                                            }
                                            className="border border-gray-300 rounded w-full px-3 py-2"
                                            placeholder={`Subtopic ${subtopicIndex + 1}`}
                                        />
                                    </div>
                                ))}
                                <button
                                    onClick={() => handleAddSubtopic(topicIndex)}
                                    className="text-sm text-blue-500 hover:underline mt-2"
                                >
                                    + Add Subtopic
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleAddTopic}
                        className="text-sm text-green-500 hover:underline mt-2"
                    >
                        + Add Topic
                    </button>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={handleCancel}
                        className="btn border-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave(topics)}
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
