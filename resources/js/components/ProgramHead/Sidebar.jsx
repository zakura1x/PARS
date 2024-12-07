import React, { useState } from "react";
import { TbCloudQuestion } from "react-icons/tb";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [activeSummary, setActiveSummary] = useState(null); // Track active summary
    const [activeItem, setActiveItem] = useState(null); // Track active list item

    // Function to handle clicking an item
    const handleItemClick = (summaryIndex, itemIndex) => {
        setActiveSummary(summaryIndex); // Set the parent summary as active
        setActiveItem(itemIndex); // Set the clicked item as active
    };

    return (
        <>
            <aside
                className={`fixed left-0 top-0 flex h-screen flex-col duration-300 ease-linear lg:static lg:translate-x-0  bg-[#42604C] text-white z-40 ${
                    isOpen ? "translate-x-0 w-72" : "-translate-x-full w-16"
                }`}
            >
                <div
                    className={`flex items-center justify-between gap-2 pt-6 ${
                        isOpen ? "px-4" : "px-2"
                    }`}
                >
                    {isOpen && <h1 className="font-semibold text-2xl">PARS</h1>}
                    <button
                        className="btn btn-square btn-ghost"
                        onClick={toggleSidebar}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="inline-block w-5 h-5 stroke-current"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>
                </div>
                {/* ITEMS */}
                <div
                    className={`no-scrollbar items-start justify-start overflow-y-auto duration-300 ease-linear ${
                        isOpen ? "flex" : "hidden"
                    }`}
                >
                    <nav className="pt-2 px-4 flex flex-col items-start">
                        <ul className="menu rounded-box w-64 text-lg">
                            <li className="text-[16px]">
                                <h3 className="text-lg font-semibold text-slate-400 tracking-wider pb-1 pt-0">
                                    Dashboard
                                </h3>
                                <details open>
                                    <summary
                                        className={`hover:bg-green-100 hover:text-black ${
                                            activeSummary === 1
                                                ? "bg-green-100 text-black"
                                                : ""
                                        }`}
                                    >
                                        <TbCloudQuestion size={26} />
                                        Question
                                    </summary>
                                    <ul className="pl-5 text-slate-400 py-1">
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 1
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(1, 1)
                                            }
                                        >
                                            <a>Add Question</a>
                                        </li>
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 2
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(1, 2)
                                            }
                                        >
                                            <a>Question List</a>
                                        </li>
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 3
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(1, 3)
                                            }
                                        >
                                            <a>Approve Question</a>
                                        </li>
                                    </ul>
                                </details>
                                <h3 className="text-lg font-semibold text-slate-400 tracking-wider pb-1 pt-0">
                                    User Management
                                </h3>
                                <details>
                                    <summary
                                        className={`hover:bg-green-100 hover:text-black ${
                                            activeSummary === 2
                                                ? "bg-green-100 text-black"
                                                : ""
                                        }`}
                                    >
                                        <TbCloudQuestion size={26} />
                                        User
                                    </summary>
                                    <ul className="pl-5 text-slate-400 py-1">
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 4
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(2, 4)
                                            }
                                        >
                                            <a>Add New User</a>
                                        </li>
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 5
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(2, 5)
                                            }
                                        >
                                            <a>User List</a>
                                        </li>
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 6
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(2, 6)
                                            }
                                        >
                                            <a>Faculty Assignment</a>
                                        </li>
                                    </ul>
                                </details>
                                <h3 className="text-lg font-semibold text-slate-400 tracking-wider pb-1 pt-0">
                                    Subject Management
                                </h3>
                                <details>
                                    <summary
                                        className={`hover:bg-green-100 hover:text-black ${
                                            activeSummary === 3
                                                ? "bg-green-100 text-black"
                                                : ""
                                        }`}
                                    >
                                        <TbCloudQuestion size={26} />
                                        Subject
                                    </summary>
                                    <ul className="pl-5 text-slate-400 py-1">
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 7
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(3, 7)
                                            }
                                        >
                                            <a>Add Subject</a>
                                        </li>
                                        <li
                                            className={`hover:text-white ${
                                                activeItem === 10
                                                    ? "text-white"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleItemClick(3, 10)
                                            }
                                        >
                                            <a>Subject List</a>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
