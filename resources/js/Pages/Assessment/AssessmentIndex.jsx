import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Pagination from "../../components/misc/Pagination"; // Import Pagination
import FlashMessage from "../../components/Notifications/FlashMessage"; // Import FlashMessage

const AssessmentIndex = ({ assessments }) => {
    const { auth, flash } = usePage().props;

    // Handle pagination
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    // Handle submitting for approval
    const handleSubmitForApproval = (assessmentId) => {
        router.put(`/assessment/update/approval/${assessmentId}`);
    };

    // Handle starting the assessment
    const handleStartAssessment = (assessmentId) => {
        router.post(`/assessment/start/${assessmentId}`);
    };

    return (
        <div className="container mx-auto p-6">
            <FlashMessage message={flash.message} />
            <h1 className="text-2xl font-bold mb-6">Assessments</h1>

            {assessments.data.length === 0 ? (
                <table className="table table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">
                                Title
                            </th>
                            <th className="border border-gray-300 p-2">
                                Status
                            </th>
                            <th className="border border-gray-300 p-2">
                                Created At
                            </th>
                            <th className="border border-gray-300 p-2">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td
                                className="border border-gray-300 p-2"
                                colSpan="4"
                            >
                                No assessments found.
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <>
                    <table className="table table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">
                                    Title
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Status
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Created At
                                </th>
                                <th className="border border-gray-300 p-2">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.data.map((assessment) => (
                                <tr key={assessment.id}>
                                    <td className="border border-gray-300 p-2">
                                        {assessment.title}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {assessment.status}
                                    </td>
                                    <td className="border border-gray-300 p-2">
                                        {new Date(
                                            assessment.created_at
                                        ).toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 p-2 space-x-2">
                                        {/* View/Edit Button */}
                                        <Link
                                            href={`/assessment/edit/form/exam/${assessment.id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View/Edit
                                        </Link>

                                        {/* Start Assessment Button (for pending assessments) */}
                                        {assessment.status === "pending" && (
                                            <button
                                                type="button"
                                                className="btn btn-success btn-sm"
                                                onClick={() =>
                                                    handleStartAssessment(
                                                        assessment.id
                                                    )
                                                }
                                            >
                                                Start Assessment
                                            </button>
                                        )}

                                        {/* View Status Button (for ongoing assessments) */}
                                        {assessment.status === "on_going" && (
                                            <Link
                                                href={`/assessment/${assessment.id}/status`}
                                                className="btn btn-info btn-sm"
                                            >
                                                View Status
                                            </Link>
                                        )}

                                        {/* View Results Button (for completed assessments) */}
                                        {assessment.status === "completed" && (
                                            <Link
                                                href={`/assessment/${assessment.id}/results`}
                                                className="btn btn-info btn-sm"
                                            >
                                                View Results
                                            </Link>
                                        )}

                                        {/* Approve Button (for program heads) */}
                                        {auth.user.role === "program_head" && (
                                            <Link
                                                href={`/assessment/approval/form/${assessment.id}`}
                                                className="btn btn-warning btn-sm"
                                            >
                                                Approve
                                            </Link>
                                        )}

                                        {/* Submit for Approval Button (for program heads) */}
                                        {auth.user.role === "program_head" && (
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() =>
                                                    handleSubmitForApproval(
                                                        assessment.id
                                                    )
                                                }
                                            >
                                                Submit for Approval
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Component */}
                    <div className="mt-4">
                        <Pagination
                            data={assessments}
                            onPageChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default AssessmentIndex;
