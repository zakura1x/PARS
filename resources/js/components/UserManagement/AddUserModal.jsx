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

    const isEditing = !!data.id;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-semibold mb-4">
                    {isEditing ? "Edit User" : "Add New User"}
                </h2>
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
                                value={data.first_name}
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
                                value={data.last_name}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        last_name: e.target.value,
                                    })
                                }
                                className={`${
                                    errors.last_name
                                        ? "border-red-500 focus:ring-red-500"
                                        : "focus:ring-blue-300"
                                }`}
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.last_name}
                                </p>
                            )}
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
                                value={data.gender}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        gender: e.target.value,
                                    })
                                }
                                className={`${
                                    errors.gender
                                        ? "border-red-500 focus:ring-red-500"
                                        : "focus:ring-blue-300"
                                }`}
                            />
                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.gender}
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                value={data.birthdate}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        birthdate: e.target.value,
                                    })
                                }
                                className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                    errors.birthdate
                                        ? "border-red-500 focus:ring-red-500"
                                        : "focus:ring-blue-300"
                                }`}
                            />
                            {errors.birthdate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.birthdate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email and Id Number */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    email: e.target.value,
                                })
                            }
                            className={`${
                                errors.email
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            ID Number
                        </label>
                        <input
                            type="text"
                            placeholder="XX-XXXXX"
                            disabled={isEditing}
                            value={data.idNumber}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    idNumber: e.target.value,
                                })
                            }
                            className={`${
                                errors.idNumber
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.idNumber && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.idNumber}
                            </p>
                        )}
                    </div>
                    {/* Role */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Access Role
                        </label>
                        <select
                            value={data.role || "program_head"}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    role: e.target.value,
                                })
                            }
                            className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                errors.role
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        >
                            <option value="program_head">Program Head</option>
                            <option value="admin">Admin</option>
                            <option value="professor">Professor</option>
                            <option value="dean">Dean</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.role}
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
                        className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                        onClick={handleSaveChanges}
                        disabled={processing}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;
