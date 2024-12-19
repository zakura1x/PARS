import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import menuItems from "../../config/menuItems";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [activeSummary, setActiveSummary] = useState(null);
    const [activeItem, setActiveItem] = useState(null);

    const handleSummaryClick = (summaryKey) => {
        setActiveSummary((prev) => (prev === summaryKey ? null : summaryKey)); // Toggle the section
    };

    const handleItemClick = (itemKey) => {
        setActiveItem(itemKey);
    };

    return (
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

            <nav
                className={`flex flex-col overflow-y-auto no-scrollbar pt-2 px-4 ${
                    isOpen ? "flex" : "hidden"
                }`}
            >
                <ul className="menu rounded-box w-64 text-lg">
                    {menuItems.map((menu, menuIndex) => (
                        <li key={menuIndex} className="font-medium text-[1rem]">
                            <h3 className="text-[0.875rem] font-semibold text-slate-400 tracking-wider pb-1 pt-0">
                                {menu.section}
                            </h3>
                            {menu.details.map((detail, detailIndex) => {
                                // Use a unique key for each section
                                const summaryKey = `${menuIndex}-${detailIndex}`;

                                return (
                                    <details
                                        key={detailIndex}
                                        open={activeSummary === summaryKey}
                                        className="mb-1"
                                    >
                                        <summary
                                            className={`cursor-pointer hover:bg-green-100 hover:text-black ${
                                                activeSummary === summaryKey
                                                    ? "bg-green-100 text-black"
                                                    : ""
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault(); // Prevent browser default toggle
                                                handleSummaryClick(summaryKey);
                                            }}
                                        >
                                            {" "}
                                            {detail.icon} {detail.title}
                                        </summary>
                                        <ul className="pl-5 text-slate-400 py-1">
                                            {detail.items.map((item) => (
                                                <li
                                                    key={item.key}
                                                    className={`hover:text-white ${
                                                        activeItem === item.key
                                                            ? "text-white"
                                                            : ""
                                                    }`}
                                                    onClick={() =>
                                                        handleItemClick(
                                                            summaryKey,
                                                            item.key
                                                        )
                                                    }
                                                >
                                                    {item.href ? (
                                                        <Link href={item.href}>
                                                            {item.label}
                                                        </Link>
                                                    ) : (
                                                        <a>{item.label}</a>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                );
                            })}
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
