import React from "react";
import { router } from "@inertiajs/react"; // Import router

const TopicTable = ({ subjects }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    //console.log(subjects);

    // Handle row click
    const handleRowClick = (id) => {
        router.get(`/topics/view/details/${id}`);
    };

    return (
        <div className="my-2 overflow-x-auto lg:mx-4">
            <table className="table-md bg-white shadow-md rounded-md">
                {/* Table Header */}
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">Subject Name</th>
                        <th className="py-3 px-4 text-left">Subject ID</th>
                        <th className="py-3 px-4 text-left">Date Added</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {subjects?.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-gray-500"
                            >
                                No Subjects found...
                            </td>
                        </tr>
                    ) : (
                        subjects.map((subject) => (
                            <tr
                                key={subject.id}
                                onClick={() => handleRowClick(subject.id)} // Handle row click
                                className="border-b text-gray-700 cursor-pointer hover:bg-gray-50" // Add hover effect
                            >
                                {/* subject Name */}
                                <td className="py-3 px-4">{subject.name}</td>

                                {/* Subject ID */}
                                <td className="py-3 px-4">
                                    {subject.subject_id || "N/A"}
                                </td>

                                {/* Date Added */}
                                <td className="py-3 px-4">
                                    {new Date(
                                        subject.created_at
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TopicTable;
