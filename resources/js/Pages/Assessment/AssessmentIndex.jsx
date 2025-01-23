import React from "react";
import { Link, router, usePage } from "@inertiajs/react";
import Pagination from "../../components/misc/Pagination"; // Import Pagination

const AssessmentIndex = ({ assessments }) => {
    const { auth } = usePage().props;
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <div className="container mx-auto p-6">
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
                                    <td className="border border-gray-300 p-2">
                                        <Link
                                            href={`/assessment/${assessment.id}`}
                                            className="btn btn-primary btn-sm"
                                        >
                                            View/Edit
                                        </Link>
                                        {auth.user.role === "program_head" && (
                                            <Link
                                                href={`/assessment/${assessment.id}/approve`}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Approve
                                            </Link>
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
