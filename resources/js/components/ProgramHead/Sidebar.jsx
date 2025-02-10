"use client";

import { useState, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { getMenuByRole } from "../../config/menuConfig";
import { ChevronDown, ChevronUp } from "lucide-react"; // Import icons

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { auth } = usePage().props;
    const [activeSummary, setActiveSummary] = useState(null);
    const [activeItem, setActiveItem] = useState(null);
    const [isHovered, setIsHovered] = useState(false);

    const menuItems = getMenuByRole(auth.user.role);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsHovered(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSummaryClick = (summaryKey) => {
        setActiveSummary((prev) => (prev === summaryKey ? null : summaryKey));
    };

    const handleItemClick = (itemKey) => {
        setActiveItem(itemKey);
    };

    const handleMouseEnter = () => {
        if (window.innerWidth >= 768) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        if (window.innerWidth >= 768) {
            setIsHovered(false);
        }
    };

    return (
        <aside
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`fixed left-0 top-0 flex h-screen flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 bg-[#42604C] text-white z-40 ${
                isOpen || isHovered
                    ? "translate-x-0 w-72"
                    : "-translate-x-full w-16"
            }`}
        >
            <div
                className={`flex items-center justify-between gap-2 pt-6 ${
                    isOpen || isHovered ? "px-4" : "px-2"
                }`}
            >
                {(isOpen || isHovered) && (
                    <h1 className="font-semibold text-2xl">PARS</h1>
                )}

                <button
                    className="btn btn-square btn-ghost hover:bg-green-700 transition-colors duration-200"
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
                    isOpen || isHovered ? "flex" : "hidden"
                }`}
            >
                <ul className="menu rounded-box w-64 text-lg">
                    {menuItems.map((menu, menuIndex) => (
                        <li key={menuIndex} className="font-medium text-[1rem]">
                            <h3 className="text-[0.875rem] font-semibold text-slate-400 tracking-wider pb-1 pt-2">
                                {menu.section}
                            </h3>
                            {menu.details.map((detail, detailIndex) => {
                                const summaryKey = `${menuIndex}-${detailIndex}`;
                                const isActive = activeSummary === summaryKey;

                                return (
                                    <details
                                        key={detailIndex}
                                        open={isActive}
                                        className="mb-1 group"
                                    >
                                        <summary
                                            className={`cursor-pointer flex items-center justify-between py-2 px-3 rounded-md transition-colors duration-200 ${
                                                isActive
                                                    ? "bg-emerald-600 text-white"
                                                    : "hover:bg-emerald-700 hover:text-white"
                                            }`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSummaryClick(summaryKey);
                                            }}
                                        >
                                            <span className="flex items-center">
                                                {detail.icon}
                                                <span className="ml-2">
                                                    {detail.title}
                                                </span>
                                            </span>
                                            {/* {isActive ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )} */}
                                        </summary>
                                        <ul className="pl-5 py-1 space-y-1">
                                            {detail.items.map((item) => (
                                                <li
                                                    key={item.key}
                                                    className={`rounded-md transition-colors duration-200 ${
                                                        activeItem === item.key
                                                            ? "bg-emerald-800 text-white"
                                                            : "text-slate-300 hover:bg-emerald-600 hover:text-white"
                                                    }`}
                                                    onClick={() =>
                                                        handleItemClick(
                                                            item.key
                                                        )
                                                    }
                                                >
                                                    {item.href ? (
                                                        <Link
                                                            href={item.href}
                                                            className="block py-2 px-3"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    ) : (
                                                        <a className="block py-2 px-3">
                                                            {item.label}
                                                        </a>
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
