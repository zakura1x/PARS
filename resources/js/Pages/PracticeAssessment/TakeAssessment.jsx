import React, { useState } from "react";
import { useForm } from "@inertiajs/react";

const TakeAssessment = ({ practiceAssessment }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const { data, setData, post, processing } = useForm({
        selected_option: null,
    });

    const currentQuestion = practiceAssessment.questions[currentQuestionIndex];

    // Progress calculation
    const progress =
        ((currentQuestionIndex + 1) / practiceAssessment.questions.length) *
        100;

    const handleOptionChange = (option) => {
        setData("selected_option", option);

        // Automatically save the answer when an option is selected
        post(
            `/student-practice-assessments/${practiceAssessment.id}/questions/${currentQuestion.question.id}/save`,
            {
                preserveScroll: true, // Prevents the page from scrolling to the top
                onSuccess: () => {
                    console.log("Answer saved successfully!");
                },
            }
        );
    };

    const handleNext = () => {
        if (currentQuestionIndex < practiceAssessment.questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmit = () => {
        // Submit the assessment
        post(`/practice-assessments/${practiceAssessment.id}/submit`, {
            onSuccess: () => {
                console.log("Assessment submitted successfully!");
            },
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Practice Assessment</h1>
            <div className="mb-4">
                <progress
                    className="progress progress-accent w-56"
                    value={progress}
                    max="100"
                ></progress>
                <p className="text-sm mt-2">
                    Progress: {Math.round(progress)}%
                </p>
            </div>
            <div className="border p-4 rounded shadow">
                <p className="text-sm mb-2">
                    Question {currentQuestionIndex + 1} of{" "}
                    {practiceAssessment.questions.length}
                </p>
                <h2 className="text-lg font-medium mb-4">
                    {currentQuestion.question.text}
                </h2>
                <ul className="space-y-2">
                    {currentQuestion.question.options.map((option, index) => (
                        <li key={index} className="flex items-center">
                            <input
                                type="radio"
                                name={`question-${currentQuestionIndex}`}
                                id={`option-${index}`}
                                value={option}
                                className="radio radio-primary mr-2"
                                onChange={() => handleOptionChange(option)}
                                checked={data.selected_option === option}
                                disabled={processing}
                            />
                            <label htmlFor={`option-${index}`}>{option}</label>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex justify-between mt-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || processing}
                    className={`btn ${
                        currentQuestionIndex === 0
                            ? "btn-disabled"
                            : "btn-primary"
                    }`}
                >
                    Previous
                </button>
                {currentQuestionIndex ===
                practiceAssessment.questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={processing}
                        className="btn btn-success"
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={processing}
                        className="btn btn-success"
                    >
                        Next
                    </button>
                )}
            </div>
            {processing && (
                <p className="mt-2 text-blue-500">Saving your answer...</p>
            )}
        </div>
    );
};

export default TakeAssessment;
