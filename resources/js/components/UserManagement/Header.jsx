import React from "react";

const Header = ({ searchQuery, setSearchQuery, setShowModal }) => (
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
                className="btn border-none bg-[#42604C] text-white hover:bg-gray-600"
                onClick={() => setShowModal(true)}
            >
                + Add User
            </button>
        </div>
    </div>
);

export default Header;
