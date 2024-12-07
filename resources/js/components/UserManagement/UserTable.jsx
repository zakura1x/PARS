import React from "react";
import { Link } from "@inertiajs/react";

const UserTable = ({ users, onPageChange, setShowModal, setData }) => (
    <div className="bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Role</th>
                    <th className="py-2 px-4 text-left">Date Added</th>
                    <th className="py-2 px-4 text-left"></th>
                </tr>
            </thead>
            <tbody>
                {users.data.map((user, index) => (
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
                        <td className="py-6 px-4">{user.full_name}</td>
                        <td className="py-6 px-4">{user.email}</td>
                        <td className="py-6 px-4 flex gap-2">
                            {user.role && (
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
                            )}
                        </td>
                        <td className="py-6 px-4">
                            {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-6 px-4">
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role={"button"}>
                                    <button className="flex flex-col items-center justify-center space-y-1 hover:text-green-500 text-black">
                                        <span className="w-1 h-1 bg-current rounded-full"></span>
                                        <span className="w-1 h-1 bg-current rounded-full"></span>
                                        <span className="w-1 h-1 bg-current rounded-full"></span>
                                    </button>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content menu bg-[#42604C] rounded-lg z-[1] w-42 p-2 text-white"
                                    >
                                        <li className="hover:bg-white/30">
                                            <a>View</a>
                                        </li>
                                        <li className="hover:bg-white/30">
                                            <a
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setData({
                                                        id: user.id,
                                                        first_name:
                                                            user.first_name,
                                                        last_name:
                                                            user.last_name,
                                                        email: user.email,
                                                        idNumber: user.idNumber,
                                                        profilePhoto:
                                                            user.profile_photo,
                                                        role: user.role,
                                                        birthdate:
                                                            user.birthdate,
                                                        gender: user.gender,
                                                    });
                                                }}
                                            >
                                                Edit
                                            </a>
                                        </li>
                                        <li className="hover:bg-white/30">
                                            <a>Delete</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
            {users.prev_page_url && (
                <Link
                    href={users.prev_page_url}
                    className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                >
                    Previous
                </Link>
            )}
            {users.next_page_url && (
                <Link
                    href={users.next_page_url}
                    className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
                >
                    Next
                </Link>
            )}
        </div>
    </div>
);

export default UserTable;
