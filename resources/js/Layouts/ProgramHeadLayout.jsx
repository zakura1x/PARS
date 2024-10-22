import Navbar from "../components/ProgramHead/Navbar";
import Sidebar from "../components/ProgramHead/Sidebar";
import React, { useState } from "react";

const ProgramHeadLayout = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="bg-[#e5e7eb] h-screen">{children}</div>
            </div>
        </div>
    );
};

export default ProgramHeadLayout;
