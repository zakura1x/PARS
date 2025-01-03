import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const AddSubtopicsModal = ({
    showModal,
    toggleModal,
    topic,
    subject,
    topicMaster,
}) => {
    const { data, setData, post, processing, errors } = useForm({
        name: "", // This should be updated correctly
        parent_id: topic.id,
        subject_id: subject.id,
    });

    const isSaving = processing;

    if (!showModal || typeof showModal !== "boolean") return null;

    const handleSave = () => {
        if (!data.name.trim()) {
            alert("Subtopic name is required.");
            return;
        }

        console.log(topicMaster.id);

        post(`/topics/${topicMaster.id}/add-topics`, {
            onSuccess: () => {
                console.log("Subtopic added successfully");
                toggleModal(); // Close the modal
                setData("name", ""); // Reset the name field
            },
            onError: (error) => {
                console.error("Error adding subtopic:", error);
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-lg font-bold mb-4">Add Subtopic</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Subtopic Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="border rounded p-2 w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)} // Update the form data
                        placeholder="Enter subtopic name"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        className="btn border bg-gray-300 text-black px-4 py-2 rounded"
                        onClick={toggleModal}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn border bg-[#42604C] text-white px-4 py-2 rounded"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving..." : "Add"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubtopicsModal;
