import React, { useState } from "react";

import { TbCloudQuestion } from "react-icons/tb";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default on mobile

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <aside
                className={`absolute left-0 top-0 flex h-screen flex-col duration-300 ease-linear lg:static lg:translate-x-0 -translate-x-full bg-[#42604C] text-white ${
                    isOpen ? "w-72" : "w-16"
                } ${isOpen ? "block" : "hidden"} md:block`}
            >
                <div
                    className={`flex items-center justify-between gap-2  py-6 ${
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
                        <h3 className="px-5 text-base font-semibold text-slate-400 tracking-wider">
                            QUESTION BANK
                        </h3>
                        <ul className="menu rounded-box w-64 text-lg">
                            <li>
                                <details open>
                                    <summary>
                                        <TbCloudQuestion size={26} />
                                        Question
                                    </summary>
                                    <ul className="pl-5 text-slate-400">
                                        <li>
                                            <a>Add question</a>
                                        </li>
                                        <li>
                                            <a>Submenu 2</a>
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
