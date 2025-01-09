import React from "react";
import { router, usePage } from "@inertiajs/react";

const PracticeStart = () => {
    const { practiceAssessmentId } = usePage().props;

    console.log(practiceAssessmentId);

    const startAssessment = () => {
        router.post(
            `/student-practice-assessments/answer/${practiceAssessmentId}`
        );
    };

    return (
        <div className="flex flex-col justify-center lg:items-center lg:justify-center min-h-svh px-4 bg-gray-100">
            <h1 className="text-3xl font-bold mb-4">
                Welcome to your Practice Assessment
            </h1>
            <p className="mb-4">
                Click the button below to start your assessment.
            </p>
            <p className="mb-6 text-gray-700">
                Disclaimer: This will affect your proficiency for every topic,
                make sure to answer each question carefully
            </p>
            <button
                className="btn btn-primary hover:bg-green-900 hover:text-white"
                onClick={startAssessment}
            >
                Start Assessment
            </button>
        </div>
    );
};

export default PracticeStart;
