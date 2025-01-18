import React from "react";
import { usePage, router } from "@inertiajs/react";
import FlashMessage from "../../components/Notifications/FlashMessage";
import Pagination from "../../components/misc/Pagination";

const PracticeIndex = (message) => {
    const { assessments, flash } = usePage().props;
    console.log(message);

    const handleClick = (assessment) => {
        const { id, status } = assessment;
        if (status === "active") {
            router.get(`/student-practice-assessments/start/${id}`);
        } else if (status === "on_going") {
            router.get(`/student-practice-assessments/take/${id}`);
        } else if (status === "completed") {
            router.get(`/student-practice-assessments/result/${id}`);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return (
                    <span className="badge badge-error bg-red-500 text-white">
                        Not Yet Answered
                    </span>
                );
            case "on_going":
                return (
                    <span className="badge badge-warning bg-purple-500 text-white">
                        On Going
                    </span>
                );
            case "completed":
                return (
                    <span className="badge badge-success bg-green-800 text-white">
                        Completed
                    </span>
                );
            default:
                return <span className="badge">Unknown</span>;
        }
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <FlashMessage message={flash.message}></FlashMessage>
            <h1 className="text-2xl font-bold mb-4">Practice Assessments</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Subject</th>
                            <th>Total Items</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.data.map((assessment) => (
                            <tr
                                key={assessment.id}
                                onClick={() => handleClick(assessment)}
                                className="hover:bg-gray-100 cursor-pointer"
                            >
                                <td>{assessment.id}</td>
                                <td>{assessment.subject.name}</td>
                                <td>{assessment.total_items}</td>
                                <td>{assessment.type}</td>
                                <td>{getStatusBadge(assessment.status)}</td>
                                <td>
                                    {new Date(
                                        assessment.created_at
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination data={assessments} onPageChange={handlePageChange} />
        </div>
    );
};

export default PracticeIndex;
