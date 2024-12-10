import React, { useState } from "react";

const Header = ({ subjects, onSearch, onFilter }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");

    //Search Input
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setSelectedSubject(value);
        onFilter(value);
    };

    <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
            Topic Management
        </h1>
        <div className="flex space-x-4">
            {/* Select Values for the subject */}
            <select
                value={selectedSubject}
                onChange={handleFilterChange}
                className="border border-grey-300 rounded px-2 py-1"
            >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                        {subject.name}
                    </option>
                ))}
            </select>

            {/* Search Topic */}
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for Topics"
            />

            {/*  */}
            <button
                className="btn border-none bg-[#42604C] text-white hover:bg-gray-600"
                onClick={() => setShowModal(true)}
            >
                + Add New Topic
            </button>
        </div>
    </div>;
};

export default Header;
