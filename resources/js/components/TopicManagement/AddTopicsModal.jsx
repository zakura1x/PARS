import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";

const AddTopicsModal = ({
    showModal,
    handleCancel,
    subjectId,
    onParentTopicAdded, // Ensure this prop is used
}) => {
    const { post, errors, data, processing, reset, setData } = useForm({
        name: "",
        subject_id: subjectId,
        parent_id: null,
    });

    if (!showModal) return null;

    const handleSaveTopic = () => {
        post(`/topics/${subjectId}/store`, {
            onSuccess: (response) => {
                reset();
                if (response.props.parentTopic) {
                    onParentTopicAdded(response.props.parentTopic); // Call the function with the new topic
                }
                handleCancel();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[500px] max-w-full relative">
                {processing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                        <span className="loading loading-ring loading-xs"></span>
                    </div>
                )}
                <h2 className="text-xl font-bold mb-4">Add Topic</h2>

                {/* Input for Topic */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Topic Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="border border-gray-300 rounded w-full px-3 py-2"
                        placeholder="Enter topic name"
                    />
                    {errors.name && (
                        <div className="text-red-500 text-sm">
                            {errors.name}
                        </div>
                    )}
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
                        onClick={handleSaveTopic}
                        className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                        disabled={processing}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddTopicsModal;
