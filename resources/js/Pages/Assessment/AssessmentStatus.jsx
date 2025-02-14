import React, { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";

const AssessmentStatus = () => {
    const { assessment, students } = usePage().props;
    const [studentStatus, setStudentStatus] = useState(students);

    useEffect(() => {
        // Polling function to fetch student status
        const fetchStudentStatus = () => {
            fetch(`/assessment/${assessment.id}/student-status`)
                .then((response) => response.json())
                .then((data) => setStudentStatus(data))
                .catch((error) =>
                    console.error("Error fetching student status:", error)
                );
        };

        // Start polling
        const interval = setInterval(fetchStudentStatus, 5000); // Poll every 5 seconds

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [assessment.id]);

    // Function to handle ending the assessment
    const endAssessment = () => {
        router.post(
            `/assessment/${assessment.id}/end`,
            {},
            {
                onSuccess: () => {
                    // Redirect to the assessment results page
                    router.visit(`/assessment/${assessment.id}/results`);
                },
                onError: (errors) => {
                    console.error("Failed to end the assessment", errors);
                },
            }
        );
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">{assessment.name}</h1>
            <p className="text-gray-700 mb-2">Status: {assessment.status}</p>

            <h2 className="text-xl font-semibold mb-4">Student Status</h2>
            {studentStatus.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentStatus.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.idNumber}</td>
                                    <td>{student.name}</td>
                                    <td>{student.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500">
                    No students have joined the assessment yet.
                </p>
            )}

            <div className="mt-6">
                <button onClick={endAssessment} className="btn btn-error">
                    End Assessment
                </button>
            </div>
        </div>
    );
};

export default AssessmentStatus;
