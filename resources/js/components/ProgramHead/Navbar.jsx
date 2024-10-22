import React from "react";
import { Link, usePage } from "@inertiajs/react";

const Navbar = ({ toggleSidebar }) => {
    const { auth } = usePage().props;

    // Create a mapping for user role
    const roles = {
        program_head: "Program Head",
        professor: "Professor",
        dean: "Dean",
        student: "Student",
    };
    const userRole = auth.user.role;
    const mappedRole = roles[userRole];

    return (
        <div className="navbar py-4 bg-gray-100 transition-all duration-300 ease-in-out w-[100%] shadow-lg justify-between lg:sticky">
            {/* Hamburger Button */}
            <button
                className="block rounded-sm border border-stroke bg-white p-1.5 shadow-sm lg:hidden"
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

            {/* TITLE */}
            <h2 className="font-bold text-lg px-6">{mappedRole} Workspace</h2>

            <div>
                <div className="flex flex-col space-y-1">
                    <h2 className="font-medium">{auth.user.name}</h2>
                    <p className="text-xs text-slate-600">{auth.user.email}</p>
                </div>
                <div className="dropdown dropdown-end">
                    <button className="btn btn-ghost btn-circle">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7 10L12 15L17 10"
                                stroke="#000000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                    <ul
                        tabIndex={0}
                        className="mt-2 z-[1] p-2 shadow menu menu-sm dropdown-content bg-[#436850] rounded-box w-52 text-white"
                    >
                        <li>
                            <a className="justify-between">Profile</a>
                        </li>
                        <li>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                type="button"
                            >
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
