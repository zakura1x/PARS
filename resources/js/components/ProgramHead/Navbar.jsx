import React, { useState } from "react";
import { usePage } from "@inertiajs/react";

const Navbar = () => {
    const { auth } = usePage().props;

    //Create a mapping for user role
    const roles = {
        program_head: "Program Head",
        professor: "Professor",
        dean: "Dean",
    };
    const userRole = auth.user.role;
    const mappedRole = roles[userRole];

    return (
        <div className="navbar py-4 bg-gray-100 transition-all duration-300 ease-in-out w-[100%] shadow-lg justify-between lg:sticky">
            {/*TITLE  */}
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
                            <a href="/login">Logout</a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Avatar and Dropdown */}
        </div>
    );
};

export default Navbar;
