import React from "react";
import { router } from "@inertiajs/react";
import Pagination from "../misc/Pagination";

const TopicTable = ({ topicmasters }) => {
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
                                className="border-b hover:bg-gray-50 text-gray-700"
                            >
                                {/* ID */}
                                <td className="py-3 px-4">{topic.id}</td>

                                {/* Topic Name */}
                                <td className="py-3 px-4">{topic.name}</td>

                                {/* Subject ID */}
                                <td className="py-3 px-4">{topic.subject_id || "N/A"}</td>

                                {/* Created By */}
                                <td className="py-3 px-4">{topic.created_by || "N/A"}</td>

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
                                    {new Date(topic.created_at).toLocaleDateString()}
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
