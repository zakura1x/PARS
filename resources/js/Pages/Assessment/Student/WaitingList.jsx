import React, { useEffect } from "react";
import { usePage, router } from "@inertiajs/react";

const WaitingList = () => {
    const { assessment } = usePage().props;

    useEffect(() => {
        // Listen for the AssessmentStarted event
        window.Echo.channel(`assessment.${assessment.id}`)
            .listen(".assessment.started", (event) => {
                // Redirect to the assessment taking page
                router.visit(`/assessment/take/${assessment.id}`);
            });

        // Clean up the listener when the component unmounts
        return () => {
            window.Echo.leaveChannel(`assessment.${assessment.id}`);
        };
    }, [assessment.id]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Waiting for Assessment to Start
                </h1>
                <div className="space-y-4">
                    <p className="text-center">
                        You have successfully joined the assessment. Please wait
                        for the professor to start the assessment.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">
                            <strong>Assessment Title:</strong> {assessment.title}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Status:</strong> {assessment.status}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Access Code:</strong> {assessment.access_code}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingList;