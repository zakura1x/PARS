import React from "react";

const AddSubjectModal = ({
    showModal,
    setShowModal,
    data,
    setData,
    handleSaveChanges,
    handleCancel,
    errors,
    processing,
    post,
    put,
    reset,
}) => {
    if (!showModal) return null;

    const isEditing = !!data.id;

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = data.id ? `/subjects/edit/${data.id}` : `/addSubject`;

        if (data.id) {
            // Use PUT for editing
            put(url, data, {
                onSuccess: (response) => {
                    console.log(response);
                    setShowModal(false); // Close the modal
                    reset(); // Reset the form
                },
            });
        } else {
            // Use POST for adding
            post(url, data, {
                onSuccess: (response) => {
                    console.log(response);
                    setShowModal(false); // Close the modal
                    reset(); // Reset the form
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {isEditing ? "Edit Subject" : "Add New Subject"}
                </h2>
                <form onSubmit={handleSubmit} id="subjectForm">
                    {/* Subject ID */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Subject ID
                        </label>
                        <input
                            type="text"
                            value={data.subject_id || ""}
                            onChange={(e) =>
                                setData({ ...data, subject_id: e.target.value })
                            }
                            className={`block w-full rounded-md border p-2 shadow-sm focus:ring-blue-500 ${
                                errors.subject_id
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.subject_id && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.subject_id}
                            </p>
                        )}
                    </div>
                    {/* Subject Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Subject Name
                        </label>
                        <input
                            type="text"
                            value={data.name || ""}
                            onChange={(e) =>
                                setData({ ...data, name: e.target.value })
                            }
                            className={`block w-full rounded-md border p-2 shadow-sm focus:ring-blue-500 ${
                                errors.name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </form>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        className="btn border-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit" // Submit the form
                        form="subjectForm" // Associate with the form
                        className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                        disabled={processing}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSubjectModal;
