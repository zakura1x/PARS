import React from "react";
import { router } from "@inertiajs/react";

const QuestionTable = ({ questions }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };
    return (
        <div className="m-4 overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-md">
                {/* Table Header */}
                <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                        <th className="py-3 px-4 text-left">ID</th>
                        <th className="py-3 px-4 text-left">Question</th>
                        <th className="py-3 px-4 text-left">Difficulty</th>
                        <th className="py-3 px-4 text-left">Subject</th>
                        <th className="py-3 px-4 text-left">Topic</th>
                        <th className="py-3 px-4 text-left">Status</th>
                        <th className="py-3 px-4 text-left">Date Added</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {questions?.data?.length === 0 ? (
                        <tr>
                            <td
                                colSpan="8"
                                className="text-center py-6 text-gray-500"
                            >
                                No questions found...
                            </td>
                        </tr>
                    ) : (
                        questions.data.map((question) => (
                            <tr
                                key={question.id}
                                className="border-b hover:bg-gray-50 text-gray-700"
                            >
                                {/* ID */}
                                <td className="py-3 px-4">{question.id}</td>

                                {/* Question Text */}
                                <td className="py-3 px-4">
                                    {question.question_text}
                                </td>

                                {/* Difficulty with Color-coded Badge */}
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            question.difficulty === "Easy"
                                                ? "bg-green-100 text-green-700"
                                                : question.difficulty ===
                                                  "Medium"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {question.difficulty}
                                    </span>
                                </td>

                                {/* Subject */}
                                <td className="py-3 px-4">
                                    {question.subject?.name || "N/A"}
                                </td>

                                {/* Topic */}
                                <td className="py-3 px-4">
                                    {question.topic?.name || "N/A"}
                                </td>

                                {/* Status with Color Badge */}
                                <td className="py-3 px-4">
                                    <span
                                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            question.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {question.status}
                                    </span>
                                </td>

                                {/* Date Added */}
                                <td className="py-3 px-4">
                                    {new Date(
                                        question.created_at
                                    ).toLocaleDateString()}
                                </td>

                                {/* Correct Options */}
                                <td className="py-3 px-4">
                                    {question.correct_answer?.length > 0
                                        ? question.correct_answer.join(", ")
                                        : "N/A"}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
                <span>
                    Showing {questions.from || 0} - {questions.to || 0} of{" "}
                    {questions.total || 0} entries
                </span>
                <div className="flex items-center gap-2">
                    {questions.links.map((link, index) => (
                        <button
                            key={index}
                            className={`px-3 py-2 text-sm rounded-md border ${
                                link.active
                                    ? "bg-green-500 text-white"
                                    : "bg-white text-gray-600"
                            } ${!link.url && "cursor-not-allowed opacity-50"}`}
                            onClick={() => handlePageChange(link.url)}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        ></button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionTable;
