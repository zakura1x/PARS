import React from "react";
import { router } from "@inertiajs/react";
import Pagination from "../misc/Pagination"; // Import Pagination

const CriteriaTopicsTable = ({ topics }) => {
    const handleEdit = (topicId) => {
        router.get(`/topic-grading-criteria/form/${topicId}`);
    };

    const handlePageChange = (url) => {
        if (url) {
            Inertia.get(url);
        }
    };

    return (
        <div className="my-2 overflow-x-auto lg:mx-4">
            <table className="table-md bg-white shadow-md rounded-md">
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">Name</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {topics.data.length === 0 ? (
                        <tr>
                            <td
                                colSpan="2"
                                className="text-center py-6 text-gray-500"
                            >
                                No topics found...
                            </td>
                        </tr>
                    ) : (
                        topics.data.map((topic) => (
                            <tr
                                key={topic.id}
                                className="border-b text-gray-700 cursor-pointer hover:bg-gray-50"
                                onClick={handleEdit}
                            >
                                <td className="py-3 px-4">{topic.name}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <Pagination data={topics} onPageChange={handlePageChange} />
        </div>
    );
};

export default CriteriaTopicsTable;
