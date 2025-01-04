import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import StudentTable from "../../components/StudentManagement/StudentTable";
import FlashMessage from "../../components/Notifications/FlashMessage";
import CreateStudent from "./CreateStudent";

const StudentManagementIndex = ({ students, searchQuery }) => {
    const [showModal, setShowModal] = useState(false);
    const { flash } = usePage().props;

    const handleSearch = (e) => {
        router.get(
            route("student.list"),
            { search: e.target.value },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <FlashMessage message={flash.message}></FlashMessage>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Student Management
                </h1>
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="px-4 py-2 border rounded-lg"
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        className="btn bg-green-900 text-white hover:bg-black border-none"
                    >
                        Add New Student
                    </button>
                </div>
            </div>

            <StudentTable students={students} setShowModal={setShowModal} />

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <CreateStudent
                        setShowModal={setShowModal}
                        showModal={showModal}
                    />
                </div>
            )}
        </div>
    );
};

export default StudentManagementIndex;
