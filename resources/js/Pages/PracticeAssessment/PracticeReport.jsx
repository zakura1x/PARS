import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { CgNotes } from "react-icons/cg";
import { IoMdSpeedometer } from "react-icons/io";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import dayjs from "dayjs";

const PracticeReport = () => {
    const { assessment, result, questions, topicProficiencies } =
        usePage().props;

    const scorePercentage =
        result.score_percentage ||
        (result.correct_answers /
            (result.correct_answer + result.incorrect_answers)) *
            100;

    const startedAt = dayjs(assessment.started_at);
    const submittedAt = dayjs(assessment.submitted_at);
    const duration = submittedAt.diff(startedAt, "minutes"); // duration in minutes

    const [activeSection, setActiveSection] = useState("assessmentResult");

    const getIcon = (isCorrect) => {
        return isCorrect ? (
            <FaCheck color="green" size={24} />
        ) : (
            <FaXmark color="red" size={24} />
        );
    };

    console.log(questions);

    return (
        <div className="m-2 p-2">
            <h2 className="text-2xl font-bold">
                Practice Assessment Report for Exam code: #{assessment.id}
            </h2>

            <div className="mt-2 flex flex-row space-x-4 overflow-x-auto max-w-full">
                <button
                    className="btn rounded-2xl bg-[#64946a] border-none text-white"
                    onClick={() => setActiveSection("assessmentResult")}
                >
                    <CgNotes size={22} />
                    Assessment Result
                </button>
                <button
                    className="btn rounded-2xl bg-[#64946a] border-none text-white"
                    onClick={() => setActiveSection("topicProficiencies")}
                >
                    <IoMdSpeedometer size={22} />
                    Topic Proficiencies
                </button>
                <button
                    className="btn rounded-2xl bg-[#64946a] border-none text-white"
                    onClick={() => setActiveSection("questions")}
                >
                    <FaFileCircleQuestion size={22} />
                    Questions
                </button>
            </div>

            {activeSection === "assessmentResult" && (
                <div>
                    <div className="flex flex-col items-center mt-4 min-w-[90%] bg-slate-100 text-black rounded-lg p-4  space-y-4">
                        <p className="text-lg font-medium">
                            Assessment Score Percentage
                        </p>
                        <div
                            className="radial-progress"
                            style={{
                                "--value": scorePercentage,
                                "--size": "12rem",
                                "--thickness": "10px",
                            }}
                            role="progressbar"
                        >
                            {scorePercentage}%
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 min-w-[90%] bg-slate-100 rounded-lg p-4 text-black ">
                        <h2 className="text-lg font-semibold">
                            Assessment Details
                        </h2>
                        <p className="text-md">
                            Total Number of Items: {assessment.total_items}
                        </p>
                        <p className="text-md">
                            Correct Items: {result.correct_answers}
                        </p>
                        <p className="text-md">
                            Time Answered: {duration} minute/s
                        </p>
                    </div>
                </div>
            )}

            {activeSection === "topicProficiencies" && (
                <div className="mt-4 flex flex-col">
                    {topicProficiencies.map((proficiency, index) => (
                        <div
                            key={index}
                            className="flex flex-col mt-2 min-w-[90%] bg-slate-100 text-black rounded-lg p-4 space-y-4"
                        >
                            <p>Topic name: {proficiency.topic_name}</p>
                            <p>Level of Proficiency:</p>
                            <p>
                                {proficiency.previous_level} to{" "}
                                {proficiency.current_level}{" "}
                            </p>
                            <div className="flex flex-col space-y-2">
                                <div className="flex flex-row space-x-4 items-center">
                                    <p>Previous Grade</p>
                                    <progress
                                        className="progress w-56 h-6 bg-black progress-success"
                                        value={proficiency.previous_grade}
                                        max="100"
                                    ></progress>
                                </div>
                                <div className="flex flex-row space-x-5 items-center">
                                    <p>Current Grade</p>
                                    <progress
                                        className="progress w-56 h-6 bg-black progress-success"
                                        value={proficiency.grade}
                                        max="100"
                                    ></progress>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeSection === "questions" && (
                <div className="mt-4 flex flex-col">
                    {questions.map((question, index) => (
                        <div key={index} className="mb-2">
                            <div className="collapse collapse-plus bg-slate-100 text-black">
                                <input
                                    type="radio"
                                    name="my-accordion-3"
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
                                                    <input
                                                        type="radio"
                                                        name={`question_${index}`}
                                                        value={option}
                                                        checked={
                                                            Array.isArray(
                                                                question.student_answer
                                                            )
                                                                ? question.student_answer.includes(
                                                                      option
                                                                  )
                                                                : option ===
                                                                  question.student_answer
                                                        }
                                                        readOnly
                                                        className={`radio border-black  ${
                                                            Array.isArray(
                                                                question.correct_answer
                                                            )
                                                                ? question.correct_answer.includes(
                                                                      option
                                                                  )
                                                                    ? "checked:bg-red-500"
                                                                    : ""
                                                                : option ===
                                                                  question.correct_answer
                                                                ? " checked:bg-red-500"
                                                                : ""
                                                        }`}
                                                    />
                                                    <span className="text-black">
                                                        {option}
                                                    </span>
                                                </label>
                                            )
                                        )}
                                    </div>

                                    {question.solution && (
                                        <div className="mt-4 space-y-2">
                                            <p>Solution:</p>
                                            {question.solution.match(
                                                /\.(jpeg|jpg|gif|png)$/
                                            ) ? (
                                                <img
                                                    src={question.solution}
                                                    alt="Solution"
                                                    className="max-w-full h-auto"
                                                />
                                            ) : question.solution.match(
                                                  /^(http|https):\/\//
                                              ) ? (
                                                <a
                                                    href={question.solution}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-black underline"
                                                >
                                                    View Solution
                                                </a>
                                            ) : (
                                                <p>{question.solution}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PracticeReport;
