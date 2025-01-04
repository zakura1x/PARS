import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../components/misc/Pagination";
import StudentEdit from "./StudentEdit";

const StudentTable = ({ students }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    const handleRowClick = async (id) => {
        try {
            const response = await axios.get(route("student.edit", id));
            if (response && response.data) {
                setSelectedUser(response.data.user);
                setSelectedStudent(response.data.student);
                setShowModal(true);
            } else {
                console.error("Error: No data found in response");
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    };

    return (
        <div className="my-2 overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-md">
                <thead>
                    <tr className="bg-gray-400 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Email</th>
                        <th className="py-3 px-4 text-left">ID Number</th>
                        <th className="py-3 px-4 text-left">Gender</th>
                        <th className="py-3 px-4 text-left">Birth Date</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {students?.data?.length === 0 ? (
                        <tr>
                            <td
                                colSpan="7"
                                className="text-center py-6 text-gray-500"
                            >
                                No students found...
                            </td>
                        </tr>
                    ) : (
                        students.data.map((student) => (
                            <tr
                                key={student.user.id}
                                className="border-b hover:bg-gray-50 text-gray-700 cursor-pointer"
                                onClick={() => handleRowClick(student.user.id)}
                            >
                                <td className="py-3 px-4">{student.user.id}</td>
                                <td className="py-3 px-4">
                                    {student.user.first_name}{" "}
                                    {student.user.last_name}
                                </td>
                                <td className="py-3 px-4">
                                    {student.user.email}
                                </td>
                                <td className="py-3 px-4">
                                    {student.user.idNumber}
                                </td>
                                <td className="py-3 px-4">{student.gender}</td>
                                <td className="py-3 px-4">
                                    {new Date(
                                        student.birth_date
                                    ).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.delete(
                                                route(
                                                    "student.destroy",
                                                    student.user.id
                                                )
                                            );
                                        }}
                                        className="text-red-600 hover:underline ml-2"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Pagination data={students} onPageChange={handlePageChange} />

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <StudentEdit
                        setShowModal={setShowModal}
                        showModal={showModal}
                        student={selectedStudent}
                        user={selectedUser}
                    />
                </div>
            )}
        </div>
    );
};

export default StudentTable;
