import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

const TakeAssessment = ({ assessment }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Ensure questions is an array
    const questions = Array.isArray(assessment.questions)
        ? assessment.questions
        : Object.values(assessment.questions);

    const { data, setData } = useForm({
        answers: questions.map((q) => q.student_answer || []),
    });

    //console.log(questions);

    const currentQuestion = questions[currentQuestionIndex];

    // Progress calculation
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleOptionChange = (option) => {
        const updatedOptions = data.answers[currentQuestionIndex].includes(
            option
        )
            ? data.answers[currentQuestionIndex].filter((opt) => opt !== option)
            : [...data.answers[currentQuestionIndex], option];

        const updatedAnswers = [...data.answers];
        updatedAnswers[currentQuestionIndex] = updatedOptions;
        setData("answers", updatedAnswers);
    };

    const handleEssayChange = (e) => {
        const essayAnswer = e.target.value;
        const updatedAnswers = [...data.answers];
        updatedAnswers[currentQuestionIndex] = [essayAnswer];
        setData("answers", updatedAnswers);
    };

    const saveAnswer = async () => {
        setLoading(true);
        setError(null);

        const selectedOption = data.answers[currentQuestionIndex];

        if (!selectedOption || selectedOption.length === 0) {
            setError("You must select or provide an answer");
            setLoading(false);
            return Promise.reject("No answer selected");
        }

        console.log(currentQuestion.id);

        try {
            await router.post(
                `/assessment/${assessment.id}/questions/${currentQuestion.id}/save`,
                {
                    selected_option: selectedOption,
                },
                {
                    preserveState: true,
                }
            );
            console.log("Answer saved successfully");
            return Promise.resolve();
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setError("Time limit exceeded. Your answer could not be saved");
            } else {
                console.error(error);
            }
            return Promise.reject(error);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            try {
                await saveAnswer(); // Wait for the save to complete
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            } catch (error) {
                console.error("Failed to save answer:", error);
            }
        }
    };

    const handlePrevious = async () => {
        if (currentQuestionIndex > 0) {
            try {
                await saveAnswer(); // Wait for the save to complete
                setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            } catch (error) {
                console.error("Failed to save answer:", error);
            }
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        try {
            await router.post(
                `/assessment/${assessment.id}/submit`,
                {},
                { preserveState: true }
            );
            console.log("Assessment submitted successfully");
        } catch (error) {
            console.error("Error details:", error);
            setError("Failed to submit assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmSubmit = () => {
        saveAnswer();
        document.getElementById("confirm_modal").showModal();
    };

    const handleModalSubmit = () => {
        document.getElementById("confirm_modal").close();
        handleSubmit();
    };

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue =
                "You have unsaved changes. Are you sure you want to leave?";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return (
        <div className="p-4 flex flex-col min-h-[90%] justify-center items-center">
            <div className="border p-4 rounded-md shadow w-[95%] bg-white">
                <p className="text-sm mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <h2 className="text-lg font-medium mb-4">
                    {currentQuestion.question_text}
                </h2>
                {currentQuestion.format_type === "multiple_choice" && (
                    <ul className="space-y-2">
                        {currentQuestion.options.map((option, index) => (
                            <li key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    name={`question-${currentQuestionIndex}`}
                                    id={`option-${index}`}
                                    value={option}
                                    className="checkbox checkbox-success mr-2"
                                    onChange={() => handleOptionChange(option)}
                                    checked={data.answers[
                                        currentQuestionIndex
                                    ].includes(option)}
                                />
                                <label htmlFor={`option-${index}`}>
                                    {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                {currentQuestion.format_type === "true_false" && (
                    <ul className="space-y-2">
                        {["True", "False"].map((option, index) => (
                            <li key={index} className="flex items-center">
                                <input
                                    type="radio"
                                    name={`question-${currentQuestionIndex}`}
                                    id={`option-${index}`}
                                    value={option}
                                    className="radio radio-primary mr-2"
                                    onChange={() => handleOptionChange(option)}
                                    checked={data.answers[
                                        currentQuestionIndex
                                    ].includes(option)}
                                />
                                <label htmlFor={`option-${index}`}>
                                    {option}
                                </label>
                            </li>
                        ))}
                    </ul>
                )}
                {currentQuestion.format_type === "essay" && (
                    <textarea
                        className="textarea textarea-bordered w-full"
                        value={data.answers[currentQuestionIndex][0] || ""}
                        onChange={handleEssayChange}
                    ></textarea>
                )}
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            <div className="mt-4">
                <progress
                    className="progress w-96"
                    value={progress}
                    max="100"
                ></progress>
            </div>

            <div className="flex flex-row space-x-2 justify-between mt-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || loading}
                    className={`btn ${
                        currentQuestionIndex === 0 || loading
                            ? "btn-disabled"
                            : "btn"
                    }`}
                >
                    Previous Question
                </button>
                {currentQuestionIndex === questions.length - 1 ? (
                    <button
                        onClick={handleConfirmSubmit}
                        className="btn btn-success"
                        disabled={loading}
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn btn-success"
                        disabled={loading}
                    >
                        Next Question
                    </button>
                )}
            </div>

            <dialog id="confirm_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Submission</h3>
                    <p className="py-4">
                        Are you sure you want to submit your answers?
                    </p>
                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() =>
                                document.getElementById("confirm_modal").close()
                            }
                        >
                            Close
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleModalSubmit}
                            disabled={loading}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default TakeAssessment;
