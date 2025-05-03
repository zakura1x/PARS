import React, { useState, useEffect, useRef } from "react";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";

const PracticeTakeAssessment = ({ practiceAssessment }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [fiveMinuteWarningShown, setFiveMinuteWarningShown] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [lastSaveTime, setLastSaveTime] = useState(0);

    // Initialize answers from localStorage or props
    const [answers, setAnswers] = useState(() => {
        const savedAnswers = localStorage.getItem(
            `assessment_${practiceAssessment.id}_answers`
        );
        return savedAnswers
            ? JSON.parse(savedAnswers)
            : Array.isArray(practiceAssessment.questions)
            ? practiceAssessment.questions.reduce(
                  (acc, q, idx) => ({
                      ...acc,
                      [idx]: q.student_answer || [],
                  }),
                  {}
              )
            : Object.values(practiceAssessment.questions).reduce(
                  (acc, q, idx) => ({
                      ...acc,
                      [idx]: q.student_answer || [],
                  }),
                  {}
              );
    });

    // Save answers to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(
            `assessment_${practiceAssessment.id}_answers`,
            JSON.stringify(answers)
        );
    }, [answers, practiceAssessment.id]);

    // Calculate initial time left
    useEffect(() => {
        if (practiceAssessment.started_at && practiceAssessment.time_limit) {
            const startedAt = new Date(practiceAssessment.started_at);
            const timeLimitParts = practiceAssessment.time_limit
                .split(":")
                .map(Number);
            const totalSeconds =
                timeLimitParts[0] * 3600 +
                timeLimitParts[1] * 60 +
                timeLimitParts[2];

            const now = new Date();
            const elapsedSeconds = Math.floor((now - startedAt) / 1000);
            const remainingSeconds = Math.max(0, totalSeconds - elapsedSeconds);

            setTimeLeft(remainingSeconds);
        }
    }, [practiceAssessment.started_at, practiceAssessment.time_limit]);

    // Timer countdown
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            timeLeftRef.current -= 1;

            if (timeLeftRef.current <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
                handleAutoSubmit();
            } else {
                setTimeLeft(timeLeftRef.current);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Show 5-minute warning
    useEffect(() => {
        if (timeLeft <= 300 && !fiveMinuteWarningShown && timeLeft > 0) {
            toast.error("Only 5 minutes remaining!", {
                duration: 5000,
                position: "top-center",
            });
            setFiveMinuteWarningShown(true);
        }
    }, [timeLeft, fiveMinuteWarningShown]);

    const questions = Array.isArray(practiceAssessment.questions)
        ? practiceAssessment.questions
        : Object.values(practiceAssessment.questions);

    const { data, setData } = useForm({
        answers: questions.map((q) => q.student_answer || []),
    });

    const currentQuestion = questions[currentQuestionIndex];

    // Format time as HH:MM:SS
    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

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
        const newAnswers = {
            ...answers,
            [currentQuestionIndex]: selectedOption,
        };
        setAnswers(newAnswers);
        localStorage.setItem(
            `assessment_${practiceAssessment.id}_answers`,
            JSON.stringify(newAnswers)
        );

        if (!selectedOption || selectedOption.length === 0) {
            setError("You must select or provide an answer");
            setLoading(false);
            return Promise.reject("No answer selected");
        }

        try {
            await router.post(
                `/student-practice-assessments/${practiceAssessment.id}/questions/${currentQuestion.question.id}/save`,
                {
                    selected_option: selectedOption,
                },
                {
                    preserveState: true,
                }
            );
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

    const toggleReview = () => {
        setShowReview(!showReview);
    };

    const handleNext = async () => {
        if (currentQuestionIndex < questions.length - 1) {
            try {
                await saveAnswer();
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            } catch (error) {
                console.error("Failed to save answer:", error);
            }
        }
    };

    const handlePrevious = async () => {
        if (currentQuestionIndex > 0) {
            try {
                await saveAnswer();
                setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
            } catch (error) {
                console.error("Failed to save answer:", error);
            }
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            await router.post(
                `/student-practice-assessments/${practiceAssessment.id}/save`,
                {},
                {
                    preserveState: true,
                }
            );
            // Clear saved answers on successful submission
            localStorage.removeItem(
                `assessment_${practiceAssessment.id}_answers`
            );
        } catch (error) {
            console.error("Error submitting assessment:", error);
            setError("Failed to submit assessment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAutoSubmit = async () => {
        if (isSubmitting) return;

        toast.error(
            "Time's up! Your assessment is being submitted automatically."
        );
        await handleSubmit();
    };

    const debouncedSave = async () => {
        if (Date.now() - lastSaveTime < 2000) return; // Don't save more than once every 2 seconds
        await saveAnswer(currentQuestionIndex);
        setLastSaveTime(Date.now());
    };

    const handleConfirmSubmit = async () => {
        try {
            // 1. Save current question first
            await saveAnswer(currentQuestionIndex);

            // 2. Show confirmation modal
            document.getElementById("confirm_modal").showModal();
        } catch (error) {
            toast.error("Failed to save current answer");
        }
    };

    const handleModalSubmit = async () => {
        document.getElementById("confirm_modal").close();
        try {
            // Final save before submission (redundant but safe)
            await saveAnswer(currentQuestionIndex);
            await handleSubmit();
        } catch (error) {
            toast.error("Submission failed");
        }
    };

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (timeLeft > 0) {
                event.preventDefault();
                event.returnValue =
                    "You have unsaved changes. Are you sure you want to leave?";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [timeLeft]);

    // Render the review screen with attachment support
    const renderReviewScreen = () => (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Review Your Answers</h2>
            <div className="space-y-4">
                {questions.map((question, index) => (
                    <div key={index} className="border-b pb-4">
                        <h3 className="font-medium">
                            Question {index + 1}:{" "}
                            {question.question.question_text}
                        </h3>
                        {question.question.attachment_path && (
                            <div className="my-2">
                                {question.question.attachment_path.match(
                                    /\.(jpe?g|png|gif)$/i
                                ) ? (
                                    <img
                                        src={`/storage/${question.question.attachment_path}`}
                                        alt="Question visual aid"
                                        className="max-w-full h-auto max-h-60"
                                    />
                                ) : question.question.attachment_path.match(
                                      /\.pdf$/i
                                  ) ? (
                                    <div className="border p-2 bg-gray-50 rounded">
                                        <a
                                            href={`/storage/${question.question.attachment_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View PDF Attachment
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href={`/storage/${question.question.attachment_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Download Attachment
                                    </a>
                                )}
                            </div>
                        )}
                        <p className="mt-2">
                            <strong>Your answer:</strong>{" "}
                            {answers[index]?.join(", ") || "Not answered"}
                        </p>
                        <button
                            onClick={() => {
                                setCurrentQuestionIndex(index);
                                setShowReview(false);
                            }}
                            className="btn btn-sm btn-outline mt-2"
                        >
                            Edit Answer
                        </button>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex justify-between">
                <button onClick={toggleReview} className="btn">
                    Back to Questions
                </button>
                <button
                    onClick={handleConfirmSubmit}
                    className="btn btn-success"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-4 flex flex-col min-h-[90%] justify-center items-center">
            {/* Timer Display */}
            <div className="fixed top-4 right-4 bg-white p-4 shadow-lg rounded-lg z-50">
                <div className="text-lg font-bold">Time Remaining:</div>
                <div
                    className={`text-2xl font-mono ${
                        timeLeft <= 300 ? "text-red-500" : "text-gray-800"
                    }`}
                >
                    {formatTime(timeLeft)}
                </div>
            </div>

            {showReview ? (
                renderReviewScreen()
            ) : (
                <>
                    {/* Question Display */}
                    <div className="border p-4 rounded-md shadow w-[95%] bg-white">
                        <p className="text-sm mb-2">
                            Question {currentQuestionIndex + 1} of{" "}
                            {questions.length}
                        </p>
                        <h2 className="text-lg font-medium mb-4">
                            {currentQuestion.question.question_text}
                        </h2>

                        {/* Display attachment if exists */}
                        {currentQuestion.question.attachment_path && (
                            <div className="mb-4">
                                {currentQuestion.question.attachment_path.match(
                                    /\.(jpe?g|png|gif)$/i
                                ) ? (
                                    <img
                                        src={`/storage/${currentQuestion.question.attachment_path}`}
                                        alt="Question visual aid"
                                        className="max-w-full h-auto max-h-60"
                                    />
                                ) : currentQuestion.question.attachment_path.match(
                                      /\.pdf$/i
                                  ) ? (
                                    <div className="border p-2 bg-gray-50 rounded">
                                        <a
                                            href={`/storage/${currentQuestion.question.attachment_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View PDF Attachment
                                        </a>
                                    </div>
                                ) : (
                                    <a
                                        href={`/storage/${currentQuestion.question.attachment_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        Download Attachment
                                    </a>
                                )}
                            </div>
                        )}

                        {currentQuestion.question.format_type ===
                            "multiple_choice" && (
                            <ul className="space-y-2">
                                {currentQuestion.question.options.map(
                                    (option, index) => (
                                        <li
                                            key={index}
                                            className="flex items-center"
                                        >
                                            <input
                                                type="checkbox"
                                                name={`question-${currentQuestionIndex}`}
                                                id={`option-${index}`}
                                                value={option}
                                                className="checkbox checkbox-success mr-2"
                                                onChange={() =>
                                                    handleOptionChange(option)
                                                }
                                                checked={data.answers[
                                                    currentQuestionIndex
                                                ].includes(option)}
                                            />
                                            <label htmlFor={`option-${index}`}>
                                                {option}
                                            </label>
                                        </li>
                                    )
                                )}
                            </ul>
                        )}

                        {currentQuestion.question.format_type ===
                            "true_false" && (
                            <ul className="space-y-2">
                                {["True", "False"].map((option, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center"
                                    >
                                        <input
                                            type="radio"
                                            name={`question-${currentQuestionIndex}`}
                                            id={`option-${index}`}
                                            value={option}
                                            className="radio radio-primary mr-2"
                                            onChange={() =>
                                                handleOptionChange(option)
                                            }
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

                        {currentQuestion.question.format_type === "essay" && (
                            <textarea
                                className="textarea textarea-bordered w-full"
                                value={
                                    data.answers[currentQuestionIndex][0] || ""
                                }
                                onChange={handleEssayChange}
                            ></textarea>
                        )}

                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <progress
                            className="progress w-96"
                            value={progress}
                            max="100"
                        ></progress>
                    </div>

                    {/* Navigation Buttons */}
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
                            <div className="flex space-x-2">
                                <button
                                    onClick={toggleReview}
                                    className="btn btn-info"
                                    disabled={loading}
                                >
                                    Review Answers
                                </button>
                                <button
                                    onClick={handleConfirmSubmit}
                                    className="btn btn-success"
                                    disabled={loading}
                                >
                                    Submit
                                </button>
                            </div>
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
                </>
            )}

            {/* Confirmation Modal */}
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default PracticeTakeAssessment;
