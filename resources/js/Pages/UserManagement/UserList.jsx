import React, { useState } from "react";
import { Head } from "@inertiajs/react";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        idNumber: "",
        profilePhoto: "",
        role: "",
    });

    const users = [
        {
            name: "Florence Shaw",
            email: "florence@untitledui.com",
            access: ["Admin"],
            lastActive: "Mar 4, 2024",
            dateAdded: "July 4, 2022",
        },
        // ... other users
    ];

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSaveChanges = () => {
        if (newUser.firstName && newUser.lastName && newUser.email) {
            console.log("User saved:", newUser);
            setShowModal(false);
            handleCancel(); // Clear fields after saving
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const handleCancel = () => {
        setNewUser({
            firstName: "",
            lastName: "",
            email: "",
            idNumber: "",
            profilePhoto: "",
            role: "",
        });
        setShowModal(false);
    };

    return (
        <>
            <Head title="User Management" />
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        User Management
                    </h1>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <button
                            className="btn bg-[#42604C] text-white"
                            onClick={() => setShowModal(true)}
                        >
                            + Add User
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white shadow rounded-lg">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 text-sm">
                                <th className="py-2 px-4 text-left"></th>
                                <th className="py-2 px-4 text-left">
                                    Full Name
                                </th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Role</th>
                                <th className="py-2 px-4 text-left">
                                    Date Added
                                </th>
                                <th className="py-2 px-4 text-left"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    className="border-b text-gray-700 hover:bg-gray-50"
                                >
                                    <td className="py-6 px-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-6 px-4">{user.name}</td>
                                    <td className="py-6 px-4">{user.email}</td>
                                    <td className="py-6 px-4 flex gap-2">
                                        {user.access.map((access, idx) => (
                                            <span
                                                key={idx}
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    access === "Admin"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-blue-100 text-blue-700"
                                                }`}
                                            >
                                                {access}
                                            </span>
                                        ))}
                                    </td>
                                    <td className="py-6 px-4">
                                        {user.dateAdded}
                                    </td>
                                    <td className="py-6 px-4">
                                        <button className="flex flex-col items-center justify-center space-y-1 hover:text-green-500 text-black">
                                            <span className="w-1 h-1 bg-current rounded-full"></span>
                                            <span className="w-1 h-1 bg-current rounded-full"></span>
                                            <span className="w-1 h-1 bg-current rounded-full"></span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-end mt-4">
                    <button className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300">
                        1
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ml-2">
                        2
                    </button>
                    <button className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 ml-2">
                        3
                    </button>
                </div>
            </div>

            {/* Add User Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Add New User
                        </h2>
                        <form>
                            {/* Profile Photo */}
                            <div className="flex items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    {newUser.profilePhoto ? (
                                        <img
                                            src={newUser.profilePhoto}
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
                                            setNewUser({
                                                ...newUser,
                                                profilePhoto:
                                                    URL.createObjectURL(
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
                                        value={newUser.firstName}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newUser.lastName}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                lastName: e.target.value,
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
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
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
                                    value={newUser.idNumber}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
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
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            role: Array.from(
                                                e.target.selectedOptions
                                            ).map((option) => option.value),
                                        })
                                    }
                                    className="w-full px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                    <option value="program_head">
                                        Program Head
                                    </option>
                                    <option value="admin">Admin</option>
                                    <option value="professor">Professor</option>
                                    <option value="dean">Dean</option>
                                </select>
                            </div>
                        </form>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 border-transparent hover:border-transparent"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn border-transparent text-white bg-[#42604C] hover:border-transparent hover:bg-gray-500 hover:text-white"
                                onClick={handleSaveChanges}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserManagement;
