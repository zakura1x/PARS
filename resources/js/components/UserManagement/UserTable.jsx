import React from "react";

const UserTable = ({ users }) => (
    <div className="bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left">Full Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Role</th>
                    <th className="py-2 px-4 text-left">Date Added</th>
                    <th className="py-2 px-4 text-left"></th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
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
                        <td className="py-6 px-4">{user.dateAdded}</td>
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
);

export default UserTable;
