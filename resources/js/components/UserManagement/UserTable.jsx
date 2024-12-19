import React from "react";
import { router } from "@inertiajs/react";
import Pagination from "../misc/Pagination";

const UserTable = ({ users, setShowModal, setData }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <div className="my-2 overflow-x-auto lg:mx-4">
            <table className="w-full border-collapse bg-white shadow-md rounded-md">
                {/* Table Header */}
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">Role</th>
                        <th className="py-3 px-4 text-left">Date Added</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {users?.data?.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-gray-500"
                            >
                                No users found...
                            </td>
                        </tr>
                    ) : (
                        users.data.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b hover:bg-gray-50 text-gray-700"
                            >
                                {/* ID */}
                                <td className="py-3 px-4">{user.id}</td>

                                {/* Name */}
                                <td className="py-3 px-4">{user.full_name}</td>

                                {/* Email */}
                                <td className="py-3 px-4">{user.email}</td>

                                {/* Role with Color-coded Badge */}
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            user.role === "professor"
                                                ? "bg-blue-100 text-blue-700"
                                                : user.role === "program_head"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {user.role}
                                    </span>
                                </td>

                                {/* Date Added */}
                                <td className="py-3 px-4">
                                    {new Date(
                                        user.created_at
                                    ).toLocaleDateString()}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => {
                                            setShowModal(true);
                                            setData({
                                                id: user.id,
                                                first_name: user.first_name,
                                                last_name: user.last_name,
                                                email: user.email,
                                                idNumber: user.idNumber,
                                                profilePhoto:
                                                    user.profile_photo,
                                                role: user.role,
                                                birthdate: user.birthdate,
                                                gender: user.gender,
                                            });
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button className="text-red-600 hover:underline ml-2">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination data={users} onPageChange={handlePageChange} />
        </div>
    );
};

export default UserTable;
