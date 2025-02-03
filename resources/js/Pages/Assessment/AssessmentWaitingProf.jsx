import React, { useEffect, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";

const AssessmentWaitingProf = ({
    assessment,
    initialWaitingStudents,
    assessmentCode,
}) => {
    const { flash } = usePage().props;
    const [waitingStudents, setWaitingStudents] = useState(
        initialWaitingStudents
    );

    const { post } = useForm();

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`/assessment/${assessment.id}/waiting-students`)
                .then((response) => response.json())
                .then((data) => setWaitingStudents(data));
        }, 5000); // Poll every 5 seconds

        return () => {
            clearInterval(interval);
        };
    }, [assessment.id]);

    // Function to handle starting the assessment
    const startAssessment = (assessmentId) => {
        post(
            `/assessment/start/${assessmentId}`,
            {},
            {
                onSuccess: () => {
                    // Redirect to the assessment status page
                    router.visit(`/assessment/${assessmentId}/status`);
                },
                onError: (errors) => {
                    console.error("Failed to start the assessment", errors);
                },
            }
        );
    };

    return (
        <div className="p-6 m-6 bg-background rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">{assessment.name}</h1>
            <p className="text-gray-700 mb-2">Status: {assessment.status}</p>
            <p className="text-gray-700 mb-4">
                Access Code:{" "}
                <span className="font-mono text-blue-600">
                    {assessmentCode}
                </span>
            </p>

            <h2 className="text-xl font-semibold mb-3">Waiting Students</h2>
            {waitingStudents.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitingStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>{student.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">
                    No students are currently waiting.
                </p>
            )}

            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => startAssessment(assessment.id)}
                    className="btn btn-primary"
                >
                    Start Assessment
                </button>
                <button className="btn btn-secondary">Cancel</button>
            </div>
        </div>
    );
};

export default AssessmentWaitingProf;
