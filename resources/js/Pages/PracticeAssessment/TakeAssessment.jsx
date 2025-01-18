import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

const TakeAssessment = ({ practiceAssessment }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, reset } = useForm({
        answers: practiceAssessment.questions.map(() => []),
    });

    const currentQuestion = practiceAssessment.questions[currentQuestionIndex];

    // Progress calculation
    const progress =
        ((currentQuestionIndex + 1) / practiceAssessment.questions.length) *
        100;

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

    //console.log(practiceAssessment);

    const handleEssayChange = (e) => {
        const essayAnswer = e.target.value;
        const updatedAnswers = [...data.answers];
        updatedAnswers[currentQuestionIndex] = [essayAnswer];
        setData("answers", updatedAnswers);
    };

    const saveAnswer = () => {
        console.log("Saving answer for question:", currentQuestion.question.id);
        console.log("Answer data:", data.answers[currentQuestionIndex]);

        const selectedOption = data.answers[currentQuestionIndex];

        router.post(
            `/student-practice-assessments/${practiceAssessment.id}/questions/${currentQuestion.question.id}/save`,
            {
                selected_option: selectedOption,
            }
        );
    };

    const handleNext = () => {
        if (currentQuestionIndex < practiceAssessment.questions.length - 1) {
            //console.log(answers);
            saveAnswer();
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            saveAnswer();
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSubmit = async () => {
        await saveAnswer();
        router.post(
            `/student-practice-assessments/${practiceAssessment.id}/save`
        );
    };

    const handleConfirmSubmit = () => {
        document.getElementById("confirm_modal").showModal();
    };

    const handleModalSubmit = async () => {
        document.getElementById("confirm_modal").close();
        await handleSubmit();
    };

    return (
        <div className="p-4 flex flex-col min-h-[90%] justify-center items-center">
            {/* <h1 className="text-xl font-bold mb-4">Practice Assessment</h1> */}

            <div className="border p-4 rounded-md shadow w-[95%] bg-white">
                <p className="text-sm mb-2">
                    Question {currentQuestionIndex + 1} of{" "}
                    {practiceAssessment.questions.length}
                </p>
                <h2 className="text-lg font-medium mb-4">
                    {currentQuestion.question.question_text}
                </h2>
                {currentQuestion.question.format_type === "multiple_choice" && (
                    <ul className="space-y-2">
                        {currentQuestion.question.options.map(
                            (option, index) => (
                                <li key={index} className="flex items-center">
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
                                        disabled={processing}
                                    />
                                    <label htmlFor={`option-${index}`}>
                                        {option}
                                    </label>
                                </li>
                            )
                        )}
                    </ul>
                )}
                {currentQuestion.question.format_type === "true_false" && (
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
                                    disabled={processing}
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
                        value={data.answers[currentQuestionIndex][0] || ""}
                        onChange={handleEssayChange}
                        disabled={processing}
                    ></textarea>
                )}
            </div>
            <div className="mt-4">
                <progress
                    className="progress w-96 bg-gray-300 [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
                    value={progress}
                    max="100"
                ></progress>
            </div>

            <div className="flex flex-row space-x-2 justify-between mt-2">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0 || processing}
                    className={`btn ${
                        currentQuestionIndex === 0
                            ? "btn-disabled text-black"
                            : "btn bg-transparent text-black hover:bg-black hover:text-white"
                    }`}
                >
                    Previous Question
                </button>
                {currentQuestionIndex ===
                practiceAssessment.questions.length - 1 ? (
                    <button
                        onClick={handleConfirmSubmit}
                        disabled={processing}
                        className="btn btn-success hover:bg-green-800 hover:text-white "
                    >
                        Submit
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={processing}
                        className="btn btn-success hover:bg-green-800 hover:text-white"
                    >
                        Next Question
                    </button>
                )}
            </div>

            {processing && (
                <p className="mt-2 text-blue-500">Saving your answer...</p>
            )}

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
                            className="btn btn-success hover:bg-green-800 hover:text-white"
                            onClick={handleModalSubmit}
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
