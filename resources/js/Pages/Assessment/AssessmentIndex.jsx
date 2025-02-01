import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Pagination from "../../components/misc/Pagination";
import FlashMessage from "../../components/Notifications/FlashMessage";

const AssessmentIndex = ({ assessments }) => {
    const { auth, flash, errors } = usePage().props;

    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    const handleSubmitForApproval = (assessmentId) => {
        router.put(`/assessment/update/approval/${assessmentId}`);
    };

    const handleStartAssessment = (assessmentId) => {
        router.put(`/assessment/update/to/wait/${assessmentId}`);
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 overflow-x-auto">
            <FlashMessage message={flash.message} />
            {errors && errors.message && (
                <div className="bg-red-100 p-4 text-red-700 rounded-lg shadow-md mb-4">
                    {errors.message}
                </div>
            )}
            <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Assessments
            </h1>

            {assessments.data.length === 0 ? (
                <div className="bg-gray-100 p-4 text-center rounded-lg shadow-md">
                    No assessments found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
                        <thead>
                            <tr className="bg-gray-100 text-left">
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
                                <tr key={assessment.id} className="border-b">
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
                                    <td className="border border-gray-300 p-2 flex flex-wrap gap-2">
                                        <Link
                                            href={`/assessment/edit/form/exam/${assessment.id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View/Edit
                                        </Link>
                                        {assessment.status === "active" && (
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
                                        {assessment.status === "on_going" && (
                                            <Link
                                                href={`/assessment/${assessment.id}/status`}
                                                className="btn btn-info btn-sm"
                                            >
                                                View Status
                                            </Link>
                                        )}
                                        {assessment.status === "completed" && (
                                            <Link
                                                href={`/assessment/${assessment.id}/results`}
                                                className="btn btn-info btn-sm"
                                            >
                                                View Results
                                            </Link>
                                        )}
                                        {auth.user.role === "program_head" && (
                                            <>
                                                <Link
                                                    href={`/assessment/approval/form/${assessment.id}`}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    Approve
                                                </Link>
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
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="mt-4">
                <Pagination
                    data={assessments}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default AssessmentIndex;
