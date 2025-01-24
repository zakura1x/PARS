import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";

const AssessmentEditForm = ({ assessment, questions }) => {
    const { data, setData, post, processing, errors } = useForm({});
    const [replacingQuestionId, setReplacingQuestionId] = useState(null); // Store the question being replaced
    const [messages, setMessages] = useState({}); // Store success/error messages

    const handleReplaceQuestion = (questionId) => {
        // Set the question currently being replaced
        setReplacingQuestionId(questionId);

        // Send the replace question request
        post(`/assessment/replace-question/${questionId}/${assessment.id}`, {
            onSuccess: (response) => {
                // Update messages and reset state on success
                setMessages({
                    success: "Question replaced successfully!",
                    replacement: response.props.replacement,
                });
                setReplacingQuestionId(null); // Clear the loading state
            },
            onError: (err) => {
                // Handle errors
                setMessages({
                    error: err.message || "Failed to replace question.",
                });
                setReplacingQuestionId(null);
            },
        });
    };

    console.log(questions);

    return (
        <div className="container mx-auto p-6">
            <div className="mb-4">
                <Link href="/assessment/index" className="btn btn-secondary">
                    Back to Assessments
                </Link>
            </div>
            <h1 className="text-2xl font-bold mb-6">
                Edit Assessment: {assessment.title}
            </h1>

            {/* Display success or error messages */}
            {messages.success && (
                <div className="alert alert-success mb-4">
                    {messages.success}
                </div>
            )}
            {messages.error && (
                <div className="alert alert-error mb-4">{messages.error}</div>
            )}

            <table className="table table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2">Question</th>
                        <th className="border border-gray-300 p-2">Topic</th>
                        <th className="border border-gray-300 p-2">
                            Difficulty
                        </th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question) => (
                        <tr key={question.id}>
                            <td className="border border-gray-300 p-2">
                                {question.text}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {question.topic_name}
                            </td>
                            <td className="border border-gray-300 p-2">
                                {question.difficulty}
                            </td>
                            <td className="border border-gray-300 p-2 text-center">
                                {/* Replace Button */}
                                <button
                                    className={`btn btn-sm ${
                                        replacingQuestionId === question.id
                                            ? "btn-disabled"
                                            : "btn-primary"
                                    }`}
                                    onClick={() =>
                                        handleReplaceQuestion(question.id)
                                    }
                                    disabled={
                                        replacingQuestionId === question.id ||
                                        processing
                                    }
                                >
                                    {replacingQuestionId === question.id
                                        ? "Replacing..."
                                        : "Replace"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssessmentEditForm;
