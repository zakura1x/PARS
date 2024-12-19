import React, { useState } from "react";

const Header = ({ searchQuery, setSearchQuery, setShowModal, subjects = [] }) => {
    const [selectedSubject, setSelectedSubject] = useState("");

    return (
        <div>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><a>Class</a></li>
                    <li><a href="/topicList">Topic Manage</a></li>
                    <li className="text-gray-500">Topic List</li>
                </ul>
            </div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Topic Management</h1>
                <div className="flex space-x-2 items-center">
                    {/* Dropdown for subjects */}
                    <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-96 px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                    >
                        <option value="" disabled>
                        {subjects.length === 0 ? "No Subjects Available" : "Select Subject"}
                        </option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>

                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600 focus:outline-none focus:ring focus:ring-blue-300"
                    />

                    {/* Add Topic Button */}
                    <button
                        className="btn border-none bg-[#42604C] text-white hover:bg-gray-600"
                        onClick={() => setShowModal(true)}
                    >
                        + Add Topic
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;
