import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

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
            post(`/assessment/update/reject/{assessmentId}${assessment.id}`, {
                data: { rejection_reason: data.rejection_reason },
            });
        } else {
            post(`/assessment/update/approve/${assessment.id}`);
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

                    <div className="flex space-x-4">
                        {/* Toggle between approval and rejection */}
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

                    {/* If rejecting, show rejection reason input */}
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

                    {/* Action button */}
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
