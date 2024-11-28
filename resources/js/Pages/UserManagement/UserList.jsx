import React, { useState } from "react";
import { Head } from "@inertiajs/react";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const users = [
        {
            name: "Florence Shaw",
            email: "florence@untitledui.com",
            access: ["Admin"],
            lastActive: "Mar 4, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Amélie Laurent",
            email: "amelie@untitledui.com",
            access: ["Admin"],
            lastActive: "Mar 4, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Ammar Foley",
            email: "ammar@untitledui.com",
            access: ["Data Export", "Data Import"],
            lastActive: "Mar 2, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Caitlyn King",
            email: "caitlyn@untitledui.com",
            access: ["Data Export", "Data Import"],
            lastActive: "Mar 6, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Sienna Hewitt",
            email: "sienna@untitledui.com",
            access: ["Data Export", "Data Import"],
            lastActive: "Mar 8, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Olly Shroeder",
            email: "olly@untitledui.com",
            access: ["Data Export", "Data Import"],
            lastActive: "Mar 8, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Mathilde Lewis",
            email: "mathilde@untitledui.com",
            access: ["Data Export", "Data Import"],
            lastActive: "Mar 6, 2024",
            dateAdded: "July 4, 2022",
        },
        {
            name: "Jaya Willis",
            email: "jaya@untitledui.com",
            access: ["Data Export", "Data Import"],
            lastActive: "Mar 4, 2024",
            dateAdded: "July 4, 2022",
        },
    ];

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="User List" />
            <div className="p-6 bg-gray-100 min-h-screen">
                {/* Header */}
                <div class="breadcrumbs text-sm">
                    <ul>
                        <li>
                            <a>User Management</a>
                        </li>
                        <li>
                            <a>Add a New User</a>
                        </li>
                    </ul>
                </div>
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
                        <button className="btn">Delete</button>
                        <button className="btn bg-[#42604C] text-white">
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
                                    <td className="py-2 px-4">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4 flex gap-2">
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
                                    <td className="py-2 px-4">
                                        {user.dateAdded}
                                    </td>
                                    <td className="py-2 px-4">
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
        </>
    );
};

export default UserManagement;
