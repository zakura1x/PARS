import React from "react";
import { Head, usePage } from "@inertiajs/react";

const AssessmentItemAnalysis = () => {
    const { assessment, questions } = usePage().props;

    // Function to get the correct/wrong indicator icon
    const getIcon = (isCorrect) => (
        <span
            className={`text-lg font-bold ${
                isCorrect ? "text-green-600" : "text-red-600"
            }`}
        >
            {isCorrect ? "✔" : "✖"}
        </span>
    );

    return (
        <div className="container mx-auto p-6">
            <Head title={`Item Analysis - ${assessment.title}`} />
            <h1 className="text-2xl font-bold mb-4">
                Item Analysis: {assessment.title}
            </h1>

            <div className="mt-4 flex flex-col">
                {questions.map((question, index) => (
                    <div key={index} className="mb-2">
                        <div className="collapse collapse-plus bg-slate-100 text-black">
                            <input
                                type="radio"
                                name="question-accordion"
                                defaultChecked
                            />
                            <div className="collapse-title text-xl font-medium">
                                <div className="flex flex-row justify-between items-center">
                                    <p>{question.question_text}</p>
                                    <div className="rounded-2xl p-2 flex bg-slate-100 flex-row items-center space-x-1">
                                        {getIcon(
                                            question.correct_answers >
                                                question.wrong_answers
                                        )}
                                        <div
                                            className={`rounded-2xl px-2 ${
                                                question.correct_answers >
                                                question.wrong_answers
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            <p className="text-base">
                                                {question.correct_answers}/
                                                {question.correct_answers +
                                                    question.wrong_answers}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="collapse-content">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <strong>Item Difficulty:</strong>{" "}
                                        {(
                                            (question.correct_answers /
                                                (question.correct_answers +
                                                    question.wrong_answers)) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </p>

                                    {Object.entries(question.option_count).map(
                                        ([option, count], idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm"
                                            >
                                                <span className="text-black">
                                                    {option}
                                                </span>
                                                <span className="text-gray-700 text-sm">
                                                    {count} students
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssessmentItemAnalysis;
