import React, { useEffect, useState } from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import { Users, ClipboardCopy, Loader2 } from "lucide-react";

const AssessmentWaitingProf = ({
    assessment,
    initialWaitingStudents,
    assessmentCode,
}) => {
    const { flash } = usePage().props;
    const [waitingStudents, setWaitingStudents] = useState(
        initialWaitingStudents
    );
    const { post, processing } = useForm();

    useEffect(() => {
        const interval = setInterval(() => {
            fetch(`/assessment/${assessment.id}/waiting-students`)
                .then((response) => response.json())
                .then((data) => setWaitingStudents(data));
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval);
    }, [assessment.id]);

    const startAssessment = (assessmentId) => {
        post(`/assessment/start/${assessmentId}`, {
            onSuccess: () => {
                // Redirect to the assessment status page
                router.visit(`/assessment/${assessmentId}/status`);
            },
            onError: (errors) => {
                console.error("Failed to start the assessment", errors);
            },
        });
    };

    const copyAssessmentCode = () => {
        navigator.clipboard.writeText(assessmentCode);
        // You can implement a toast notification here using daisyUI's toast component
    };

    return (
        <div className="card w-full max-w-4xl mx-auto bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl">{assessment.name}</h2>
                <div className="flex items-center space-x-2 mb-4">
                    <span
                        className={`badge ${
                            assessment.status === "Waiting"
                                ? "badge-secondary"
                                : "badge-primary"
                        }`}
                    >
                        {assessment.status}
                    </span>
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={copyAssessmentCode}
                    >
                        <ClipboardCopy className="w-4 h-4 mr-2" />
                        Copy Code: {assessmentCode}
                    </button>
                </div>
                <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 mr-2" />
                    <h3 className="text-xl font-semibold">Waiting Students</h3>
                </div>
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
                                        <td>{student.idNumber}</td>
                                        <td>{student.full_name}</td>
                                        <td>{student.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-base-content opacity-70">
                        No students are currently waiting.
                    </p>
                )}
                <div className="card-actions justify-end mt-6">
                    <button
                        className="btn btn-ghost"
                        onClick={() => window.history.back()}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => startAssessment(assessment.id)}
                        disabled={processing}
                    >
                        {processing && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Start Assessment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssessmentWaitingProf;
