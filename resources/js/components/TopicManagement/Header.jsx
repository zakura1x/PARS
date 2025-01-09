import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

const Header = ({ searchQuery, setSearchQuery, setShowModal }) => {
    const [selectedSubject, setSelectedSubject] = useState("");
    const { subjects } = usePage().props;

    return (
        <div className="space-y-4">
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a>Class</a>
                    </li>
                    <li className="text-gray-500">Topic List</li>
                </ul>
            </div>
            <div className="flex flex-col lg:flex-row lg:justify-normal lg:space-x-4 justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Topic Management
                </h1>
            </div>
        </div>
    );
};

export default Header;
