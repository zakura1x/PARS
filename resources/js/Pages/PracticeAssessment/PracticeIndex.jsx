import React from "react";
import { usePage } from "@inertiajs/react";

const PracticeIndex = () => {
    const { assessments } = usePage().props;

    //console.log(assessments);

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
                    </tr>
                </thead>
                <tbody>
                    {assessments.map((assessment) => (
                        <tr key={assessment.id}>
                            <td>{assessment.id}</td>
                            <td>{assessment.subject.name}</td>
                            <td>{assessment.total_items}</td>
                            <td>{assessment.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PracticeIndex;
