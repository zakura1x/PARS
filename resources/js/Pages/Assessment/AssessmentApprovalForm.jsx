import React, { useState } from "react";
import { useForm, router } from "@inertiajs/react";

const AssessmentApprovalForm = ({ assessment }) => {
    const { data, setData, post, processing, errors } = useForm({
        rejection_reason: "", // Initial rejection reason
        approved: assessment.approved, // To show if it's already approved
    });

    const [isRejection, setIsRejection] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // If the assessment is already approved, prevent submission
        if (assessment.approved) {
            alert(
                "This assessment is already approved and cannot be modified."
            );
            return;
        }

        // Determine action based on whether it's rejection or approval
        if (isRejection) {
            post(`/assessment/update/reject/${assessment.id}`, {
                data: { rejection_reason: data.rejection_reason },
            });
        } else {
            router.put(`/assessment/update/approve/${assessment.id}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Approve or Reject Assessment
            </h1>

            {assessment.approved ? (
                <div className="alert alert-success">
                    This assessment has already been approved.
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Assessment Details */}
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Assessment Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="input input-bordered w-full"
                            value={assessment.title}
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Status
                        </label>
                        <select
                            id="status"
                            className="select select-bordered w-full"
                            value={assessment.status}
                            disabled
                        >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Questions Display */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Questions for Review
                        </h2>
                        <ul className="space-y-4">
                            {assessment.questions.map((question, index) => (
                                <li
                                    key={question.id}
                                    className="border p-4 rounded-lg shadow-sm"
                                >
                                    <div className="mb-2">
                                        <strong>Question {index + 1}:</strong>{" "}
                                        {question.question_text}
                                    </div>
                                    <div className="mb-2">
                                        <strong>Options:</strong>
                                        <ul className="list-disc ml-6">
                                            {question.options.map(
                                                (option, i) => (
                                                    <li
                                                        key={i}
                                                        className={
                                                            question.correct_answer.includes(
                                                                option
                                                            )
                                                                ? "font-bold text-green-600"
                                                                : ""
                                                        }
                                                    >
                                                        {option}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <strong>Correct Answer:</strong>{" "}
                                        {question.correct_answer.join(", ")}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Toggle between approval and rejection */}
                    <div className="flex space-x-4 mb-4">
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="action"
                                    checked={!isRejection}
                                    onChange={() => setIsRejection(false)}
                                />
                                <span>Approve</span>
                            </label>
                        </div>
                        <div>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="action"
                                    checked={isRejection}
                                    onChange={() => setIsRejection(true)}
                                />
                                <span>Reject</span>
                            </label>
                        </div>
                    </div>

                    {/* Rejection Reason Input */}
                    {isRejection && (
                        <div className="mb-4">
                            <label
                                htmlFor="rejection_reason"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Rejection Reason
                            </label>
                            <textarea
                                id="rejection_reason"
                                value={data.rejection_reason}
                                onChange={(e) =>
                                    setData("rejection_reason", e.target.value)
                                }
                                className="textarea textarea-bordered w-full"
                                placeholder="Enter the reason for rejection"
                            ></textarea>
                            {errors.rejection_reason && (
                                <div className="text-red-600 text-xs">
                                    {errors.rejection_reason}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={processing || assessment.approved}
                        >
                            {processing
                                ? "Processing..."
                                : isRejection
                                ? "Reject"
                                : "Approve"}
                        </button>
                    </div>

                    {errors.message && (
                        <div className="text-red-600">{errors.message}</div>
                    )}
                </form>
            )}
        </div>
    );
};

export default AssessmentApprovalForm;
