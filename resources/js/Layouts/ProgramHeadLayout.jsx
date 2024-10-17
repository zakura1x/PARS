import Navbar from "../components/ProgramHead/Navbar";
import Sidebar from "../components/ProgramHead/Sidebar";

const ProgramHeadLayout = ({ children }) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                <Navbar />
                <div className="bg-[#e5e7eb] h-screen">{children}</div>
            </div>
        </div>
    );
};

export default ProgramHeadLayout;
