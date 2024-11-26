import React, { useState } from "react";
import { TbCloudQuestion } from "react-icons/tb";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default on mobile
    const [activeSummary, setActiveSummary] = useState(null); // Track active summary
    const [activeItem, setActiveItem] = useState(null); // Track active list item

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Function to handle clicking an item
    const handleItemClick = (summaryIndex, itemIndex) => {
        setActiveSummary(summaryIndex); // Set the parent summary as active
        setActiveItem(itemIndex); // Set the clicked item as active
    };

    return (
        <>
            <aside
                className={`absolute left-0 top-0 flex h-screen flex-col duration-300 ease-linear lg:static lg:translate-x-0 -translate-x-full bg-[#42604C] text-white ${
                    isOpen ? "w-72" : "w-16"
                } ${isOpen ? "block" : "hidden"} md:block`}
            >
                <div
                    className={`flex items-center justify-between gap-2 py-6 ${
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
                    <nav className="py-4 px-4 flex flex-col items-start">
                        <h3 className="px-5 text-lg font-semibold text-slate-400 tracking-wider">
                            Dashboard
                        </h3>
                        <ul className="menu rounded-box w-64 text-lg">
                            <li>
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
                                    <ul className="pl-5 text-slate-400 py-2">
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
                                <details close>
                                    <summary
                                        className={`hover:bg-green-100 hover:text-black ${
                                            activeSummary === 2
                                                ? "bg-green-100 text-black"
                                                : ""
                                        }`}
                                    >
                                        <TbCloudQuestion size={26} />
                                        Question
                                    </summary>
                                    <ul className="pl-5 text-slate-400 py-2">
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
                                            <a>Add Question</a>
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
                                            <a>Question List</a>
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
                                            <a>Approve Question</a>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Burger Icon (only visible on mobile) */}
            <button
                className={`btn btn-square btn-ghost fixed top-4 left-4 z-50 md:hidden ${
                    isOpen ? "hidden" : "flex"
                }`}
                onClick={toggleSidebar}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>
        </>
    );
};

export default Sidebar;
