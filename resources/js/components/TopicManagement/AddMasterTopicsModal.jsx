import React from "react";

const AddMasterTopicsModal = ({
    showModal,
    handleCancel,
    handleSaveChanges,
    data,
    setData,
    errors,
    subjects,
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg w-[700px] max-w-full">
                <h2 className="text-xl font-bold mb-4">Add New Master Topic</h2>

                {/* TOPIC NAME */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Master Topic Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="border border-gray-300 rounded w-full px-3 py-2"
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">
                            {errors.name}
                        </span>
                    )}
                </div>

                {/* SUBJECT */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Subject
                    </label>
                    <select
                        value={data.subject_id}
                        onChange={(e) => setData("subject_id", e.target.value)}
                        className="border border-gray-300 rounded w-full px-3 py-2"
                    >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {errors.subject_id && (
                        <span className="text-red-500 text-sm">
                            {errors.subject_id}
                        </span>
                    )}
                </div>

                {/* STATUS */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Status
                    </label>
                    <select
                        value={data.status}
                        onChange={(e) =>
                            setData("status", e.target.value === "true")
                        }
                        className="border border-gray-300 rounded w-full px-3 py-2"
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        onClick={handleCancel}
                        className="btn border-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMasterTopicsModal;
