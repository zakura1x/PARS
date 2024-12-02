import React from "react";

const AddUserModal = ({
    showModal,
    setShowModal,
    data,
    setData,
    handleSaveChanges,
    handleCancel,
    errors,
    processing,
}) => {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                <form onSubmit={handleSaveChanges}>
                    {/* Profile Photo */}
                    <div className="flex items-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            {data?.profilePhoto ? (
                                <img
                                    src={data.profilePhoto}
                                    alt="Profile"
                                    className="rounded-full w-full h-full"
                                />
                            ) : (
                                "Photo"
                            )}
                        </div>
                        <div className="ml-4">
                            <label className="text-sm text-gray-600">
                                Profile photo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        profilePhoto: URL.createObjectURL(
                                            e.target.files[0]
                                        ),
                                    })
                                }
                                className="text-sm text-gray-600 mt-1"
                            />
                        </div>
                    </div>
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={data?.first_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        first_name: e.target.value,
                                    })
                                }
                                className={`${
                                    errors.first_name
                                        ? "border-red-500 focus:ring-red-500"
                                        : "focus:ring-blue-300"
                                }`}
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Last Name
                            </label>
                            <input
                                type="text"
                                value={data?.last_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        last_name: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>
                    {/* Gender */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Gender
                            </label>
                            <input
                                type="text"
                                value={data?.gender}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        gender: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                value={data?.birthdate}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        birthdate: e.target.value,
                                    })
                                }
                                className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                    </div>

                    {/* Email and Id Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data?.email}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    email: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            ID Number
                        </label>
                        <input
                            type="text"
                            placeholder="XX-XXXXX"
                            value={data?.idNumber}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    idNumber: e.target.value,
                                })
                            }
                            className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>
                    {/* Role */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Access Role
                        </label>
                        <select
                            value={data?.role}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    role: Array.from(
                                        e.target.selectedOptions
                                    ).map((option) => option.value),
                                })
                            }
                            className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="program_head">Program Head</option>
                            <option value="admin">Admin</option>
                            <option value="professor">Professor</option>
                            <option value="dean">Dean</option>
                        </select>
                    </div>
                </form>

                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn bg-[#42604C] text-white"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
