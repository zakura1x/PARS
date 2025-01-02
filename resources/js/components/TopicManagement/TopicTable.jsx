import React from "react";
import { router } from "@inertiajs/react"; // Import router
import Pagination from "../misc/Pagination";

const TopicTable = ({ topicmasters }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    // Handle row click
    const handleRowClick = (id) => {
        router.get(`/topic-masters/${id}/edit`);
    };

    return (
        <div className="my-2 overflow-x-auto lg:mx-4">
            <table className="table-md bg-white shadow-md rounded-md">
                {/* Table Header */}
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Topic Name</th>
                        <th className="py-3 px-4 text-left">Subject ID</th>
                        <th className="py-3 px-4 text-left">Created By</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Date Added</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {topicmasters?.data?.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                className="text-center py-6 text-gray-500"
                            >
                                No topics found...
                            </td>
                        </tr>
                    ) : (
                        topicmasters.data.map((topic) => (
                            <tr
                                key={topic.id}
                                onClick={() => handleRowClick(topic.id)} // Handle row click
                                className="border-b text-gray-700 cursor-pointer hover:bg-gray-50" // Add hover effect
                            >
                                {/* ID */}
                                <td className="py-3 px-4">{topic.id}</td>

                                {/* Topic Name */}
                                <td className="py-3 px-4">{topic.name}</td>

                                {/* Subject ID */}
                                <td className="py-3 px-4">
                                    {topic.subject_id || "N/A"}
                                </td>

                                {/* Created By */}
                                <td className="py-3 px-4">
                                    {topic.creator?.first_name || "N/A"}
                                </td>

                                {/* Status with Color-coded Badge */}
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            topic.status
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {topic.status ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* Date Added */}
                                <td className="py-3 px-4">
                                    {new Date(
                                        topic.created_at
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination data={topicmasters} onPageChange={handlePageChange} />
        </div>
    );
};

export default TopicTable;
