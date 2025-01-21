import React from "react";
import { Link } from "@inertiajs/react";

const AssessmentIndex = ({ assessments }) => {
    return (
        <div>
            <h1>Assessments</h1>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {assessments.map((assessment) => (
                        <tr key={assessment.id}>
                            <td>{assessment.title}</td>
                            <td>{assessment.subject.name}</td>
                            <td>{assessment.status}</td>
                            <td>
                                <Link
                                    href={`/assessments/${assessment.id}/edit`}
                                >
                                    Edit
                                </Link>
                                <Link href={`/assessments/${assessment.id}`}>
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssessmentIndex;
