import React, { useState } from "react";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false); // Sidebar is hidden by default on mobile

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`absolute left-0 top-0 h-screen bg-[#D0D9D3] shadow-right flex-col transition-width duration-300 ${
                    isOpen ? "w-64" : "w-16"
                } ${isOpen ? "block" : "hidden"} md:block`}
            >
                <div
                    className={`flex items-center justify-between gap-2  py-6 ${
                        isOpen ? "px-4" : "px-2"
                    }`}
                >
                    {/* ICON */}
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
                <nav className="flex flex-col gap-4 px-4">
                    <button className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 12h18M9 6l-6 6 6 6"
                            />
                        </svg>
                        {isOpen && <span>Dashboard</span>}
                    </button>
                    <button className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        {isOpen && <span>Tasks</span>}
                    </button>
                    <button className="flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12H3m12-6l-6 6 6 6"
                            />
                        </svg>
                        {isOpen && <span>Settings</span>}
                    </button>
                </nav>
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
