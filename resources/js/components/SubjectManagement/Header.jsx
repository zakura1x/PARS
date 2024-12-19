import React from "react";

const Header = ({ searchQuery, setSearchQuery, setShowModal }) => (
    <div>
        <div className="breadcrumbs text-sm">
            <ul>
                <li><a>Class</a></li>
                <li><a href="/subjectList">Subject Manage</a></li>
                <li className="text-gray-500">Subject List</li>
            </ul>
        </div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
                Subject Management
            </h1>
            <div className="flex space-x-2">
                <button
                    className="btn border-none bg-[#42604C] text-white hover:bg-gray-600"
                    onClick={() => setShowModal(true)}
                >
                    + Add Subject
                </button>
            </div>
        </div>
    </div>
);

export default Header;
