import React from "react";
import { FaFolder } from "react-icons/fa";
import { Link, usePage } from "@inertiajs/react";

const StudentShowTopics = ({
    parentTopics = [],
    subTopics = [],
    isLoading,
}) => {
    const { subjectName, subjectCode } = usePage().props;

    const sortedParentTopics = Array.isArray(parentTopics)
        ? parentTopics.sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
        : Object.values(parentTopics).sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id));

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Breadcrumb Navigation */}
            <div className="mb-4 text-sm text-gray-600">
                <Link href="/study-materials/index" className="text-[#42604C] font-semibold hover:underline">
                    Subjects
                </Link>
                <span className="mx-2 text-gray-400">{'>'}</span>
                <span className="text-gray-800 font-medium">{subjectCode} - {subjectName}</span>
            </div>

            {/* Topics List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {sortedParentTopics.length > 0 ? (
                    sortedParentTopics.map((topic, index) => (
                        <div
                            key={topic.id}
                            className="flex justify-between items-center border-b px-6 py-4 hover:bg-gray-50 transition"
                        >
                            <p className="text-lg font-medium text-gray-800">
                                {topic.name || `Topic ${index + 1}`}
                            </p>
                            <Link
                                href={`/study-materials/subtopic/${topic.id}`}
                                className="flex items-center space-x-2 px-4 py-2 bg-[#42604C] text-white rounded-full hover:bg-[#365040] transition"
                            >
                                <FaFolder className="text-sm" />
                                <span className="text-sm font-semibold">View Study Materials</span>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500 italic">
                        No topics available. Please add your topics.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentShowTopics;
