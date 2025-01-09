import React from "react";
import { usePage, router } from "@inertiajs/react";

const PracticeIndex = () => {
    const { assessments } = usePage().props;

    const handleClick = (assessment) => {
        const { id, status } = assessment;
        if (status === "active") {
            router.get(`/student-practice-assessments/start/${id}`);
        } else if (status === "on_going") {
            router.get(`/student-practice-assessments/take/${id}`);
        } else if (status === "completed") {
            router.get(`/student-practice-assessments/report/${id}`);
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

    return (
        <div>
            <h1>Practice Assessments</h1>
            <table>
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
                    {assessments.map((assessment) => (
                        <tr
                            key={assessment.id}
                            onClick={() => handleClick(assessment)}
                            style={{ cursor: "pointer" }}
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
    );
};

export default PracticeIndex;
