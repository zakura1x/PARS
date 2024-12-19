import React, { useState } from "react";
import { router } from "@inertiajs/react";

const Header = ({ setShowModal }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value); // Update state with user input

        // Trigger server-side search request
        router.get(
            "/UserList",
            { search: value }, // Send search query to backend
            { preserveState: true, preserveScroll: true }
        );
    };

    return (
        <div>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><a>User Management</a></li>
                    <li><a href="/UserList">User</a></li>
                    <li className="text-gray-500">User List</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    User Management
                </h1>
                <div className="flex space-x-4">
                    {/* Search Bar */}
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange} // Update search query on input
                        placeholder="Search for Users"
                        className="border border-gray-300 rounded px-2 py-1"
                    />
                    <button
                        className="btn border-none bg-[#42604C] text-white hover:bg-gray-600"
                        onClick={() => setShowModal(true)} // Call setShowModal when clicked
                    >
                        + Add New User
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
