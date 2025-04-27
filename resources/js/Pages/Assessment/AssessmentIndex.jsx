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

    const renderActionButton = (assessment) => {
        return (
            <Link
                href={`/assessment/edit/form/exam/${assessment.id}`}
                className="btn btn-info btn-sm"
            >
                View Assessment
            </Link>
        );
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            <FlashMessage message={flash.message} />
            {errors && errors.message && (
                <div className="alert alert-error shadow-lg">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current flex-shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{errors.message}</span>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Assessments</h1>
            </div>

            {assessments.data.length === 0 ? (
                <div className="alert alert-info shadow-lg">
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current flex-shrink-0 w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <span>No assessments found.</span>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assessments.data.map((assessment) => (
                                <tr key={assessment.id}>
                                    <td>{assessment.title}</td>
                                    <td>
                                        <span
                                            className={`badge ${getStatusBadgeColor(
                                                assessment.status
                                            )}`}
                                        >
                                            {assessment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            assessment.created_at
                                        ).toLocaleString()}
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap gap-2">
                                            {renderActionButton(assessment)}
                                        </div>
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

const getStatusBadgeColor = (status) => {
    switch (status) {
        case "active":
            return "badge-success";
        case "on_going":
            return "badge-warning";
        case "completed":
            return "badge-info";
        default:
            return "badge-ghost";
    }
};

export default AssessmentIndex;
