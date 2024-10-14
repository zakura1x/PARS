import React from "react";

const Navbar = () => {
    return (
        <div className="navbar mx-50 bg-[#D0D9D3] transition-all duration-300 ease-in-out w-[100%]">
            <div className="flex-1">
                <b>
                    <a className="ml-4 text-xl">
                        PARS - Program Head's Workspace
                    </a>
                </b>
            </div>
            <div className="flex-none gap-2">
                {/* Avatar and Dropdown */}
                <div className="dropdown dropdown-end">
                    <div
                        tabIndex={0}
                        role="button"
                        className="btn btn-ghost btn-circle avatar"
                    >
                        <div className="w-10 rounded-full">
                            <img
                                src="https://as2.ftcdn.net/v2/jpg/08/97/97/81/1000_F_897978123_8JIh7WjXzMzgbDEKD9e49fz08TyXvsvs.jpg"
                                alt="User Avatar"
                            />
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
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
        </div>
    );
};

export default Navbar;
