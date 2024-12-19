import React from "react";
import { router } from "@inertiajs/react";
import Pagination from "../misc/Pagination";

const SubjectTable = ({ subjects, onEditSubject }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <div className="my-2 overflow-x-auto lg:mx-4">
            <table className="w-full border-collapse bg-white shadow-md rounded-md">
                {/* Table Header */}
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">Subject ID</th>
                        <th className="py-3 px-4 text-left">Subject Name</th>
                        <th className="py-3 px-4 text-left">Created By</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Date Added</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {subjects?.data?.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-gray-500"
                            >
                                No subjects found...
                            </td>
                        </tr>
                    ) : (
                        subjects.data.map((subject) => (
                            <tr
                                key={subject.id}
                                className="border-b hover:bg-gray-50 text-gray-700"
                            >
                                {/* Subject ID */}
                                <td className="py-3 px-4">{subject.subject_id}</td>

                                {/* Subject Name */}
                                <td className="py-3 px-4">{subject.name}</td>

                                {/* Created By */}
                                <td className="py-3 px-4">{subject.created_by}</td>

                                {/* Status with Color-coded Badge */}
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            subject.status
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {subject.status ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* Date Added */}
                                <td className="py-3 px-4">
                                    {new Date(subject.created_at).toLocaleDateString()}
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 text-center">
                                    <button
                                        className="text-blue-500 hover:underline"
                                        onClick={() => onEditSubject(subject)}
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination data={subjects} onPageChange={handlePageChange} />
        </div>
    );
};

export default SubjectTable;
