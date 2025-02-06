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
                                        {getIcon(question.is_correct)}
                                        <div
                                            className={`rounded-2xl px-2 ${
                                                question.is_correct
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            <p className="text-base">
                                                {question.is_correct
                                                    ? `${question.score}/${question.score}`
                                                    : `0/${question.score}`}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="collapse-content">
                                <div className="flex flex-col space-y-2">
                                    {question.question_options.map(
                                        (option, idx) => (
                                            <label
                                                key={idx}
                                                className="flex items-center space-x-2"
                                            >
                                                <div
                                                    className={`w-5 h-5 flex items-center justify-center border border-black rounded ${
                                                        question.student_answer.includes(
                                                            option
                                                        )
                                                            ? question.correct_answer.includes(
                                                                  option
                                                              )
                                                                ? "bg-green-500" // Correct and selected
                                                                : "bg-red-500" // Incorrect and selected
                                                            : question.correct_answer.includes(
                                                                  option
                                                              )
                                                            ? "bg-green-500" // Correct but not selected
                                                            : "bg-white"
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        name={`question_${index}`}
                                                        value={option}
                                                        checked={question.student_answer.includes(
                                                            option
                                                        )}
                                                        readOnly
                                                        className="opacity-0 absolute w-full h-full"
                                                    />
                                                </div>
                                                <span className="text-black">
                                                    {option}
                                                </span>
                                            </label>
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
