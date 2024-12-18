import React from "react";

const Header = () => {
    return (
        <div>
            <div className="breadcrumbs text-sm">
                <ul>
                    <li><a href="/dashboard">Dashboard</a></li>
                    <li><a href="/questionBank">Question</a></li>
                    <li className="text-gray-500">Question List</li>
                </ul>
            </div>
            <div className="flex justify-between items-center flex-row p-4 md:py-0  space-x-6">
                <h4 className="font-bold text-[24px] ">Questions</h4>
                <div className="space-x-4 space-y-2 md:space-y-0 flex-col md:flex-row">
                    <button className="btn border-none bg-[#42604C] text-white hover:bg-gray-600 px-4">
                        + Add New Question
                    </button>
                    <button className="btn border-none bg-[#42604C] text-white hover:bg-gray-600 px-4">
                        Import Question/s
                    </button>
                    <button className="btn border-none bg-[#42604C] text-white hover:bg-gray-600 px-4">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header;

