import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import { CgNotes } from "react-icons/cg";
import { IoMdSpeedometer } from "react-icons/io";
import { FaFileCircleQuestion } from "react-icons/fa6";
import { FaCheck, FaXmark } from "react-icons/fa6";
import dayjs from "dayjs";

const IndividualAssessmentReport = () => {
    const { assessment, result, questions, topicProficiencies } = usePage().props;

    const scorePercentage = result.score || (result.correct_answers / (result.correct_answers + result.incorrect_answers)) * 100;

    const startedAt = dayjs(assessment.started_at);
    const submittedAt = dayjs(assessment.submitted_at);
    const duration = submittedAt.diff(startedAt, "minutes");

    const [activeSection, setActiveSection] = useState("assessmentResult");

    const getIcon = (isCorrect) => {
        return isCorrect ? (<FaCheck color="green" size={24} />) : (<FaXmark color="red" size={24} />);
    };

    // console.log(result);

    return (
        <div className="m-2 p-2">
            <h2 className="text-2xl font-bold"> Assessment Report for Exam code: #{assessment.id}</h2>

            <div className="mt-2 flex flex-row space-x-4 overflow-x-auto max-w-full">
                <button
                    className="btn rounded-2xl bg-[#64946a] border-none text-white"
                    onClick={() => setActiveSection("assessmentResult")}
                >
                    <CgNotes size={22} /> Assessment Result
                </button>
                <button
                    className="btn rounded-2xl bg-[#64946a] border-none text-white"
                    onClick={() => setActiveSection("topicProficiencies")}
                >
                    <IoMdSpeedometer size={22} /> Topic Proficiencies
                </button>
                <button
                    className="btn rounded-2xl bg-[#64946a] border-none text-white"
                    onClick={() => setActiveSection("questions")}
                >
                    <FaFileCircleQuestion size={22} /> Questions
                </button>
            </div>

            {activeSection === "assessmentResult" && (
                <div>
                    <div className="flex flex-col items-center mt-4 min-w-[90%] bg-slate-100 text-black rounded-lg p-6 space-y-4">
                        <p className="text-lg font-medium">Assessment Score Percentage</p>
                        <div className="relative w-64 h-64">
                            {/* Background circle (always complete) */}
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#C0C0C0" strokeWidth="8" />

                                {/* Progress circle with gradient */}
                                <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke={`url(#gradient-${
                                    scorePercentage >= 70 ? "success" : scorePercentage >= 50 ? "warning" : "danger"
                                })`}
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 45}`}
                                strokeDashoffset={`${2 * Math.PI * 45 * (1 - scorePercentage / 100)}`}
                                transform="rotate(-90 50 50)"
                                />

                                {/* Gradient definitions */}
                                <defs>
                                <linearGradient id="gradient-success" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#4ade80" />
                                    <stop offset="100%" stopColor="#16a34a" />
                                </linearGradient>
                                <linearGradient id="gradient-warning" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                                <linearGradient id="gradient-danger" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#f87171" />
                                    <stop offset="100%" stopColor="#dc2626" />
                                </linearGradient>
                                </defs>
                            </svg>

                            {/* Center content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{Math.round(scorePercentage)}%</span>
                                <span
                                className="text-sm mt-2 font-medium"
                                style={{
                                    color: scorePercentage >= 70 ? "#16a34a" : scorePercentage >= 50 ? "#d97706" : "#dc2626",
                                }}
                                >
                                {scorePercentage >= 70 ? "Excellent" : scorePercentage >= 50 ? "Good" : "Needs Improvement"}
                                </span>
                            </div>
                        </div>

                        {/* Performance indicators */}
                        <div className="flex justify-center space-x-6 mt-2">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-xs">0-49%</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                            <span className="text-xs">50-69%</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
                            <span className="text-xs">70-100%</span>
                        </div>
                        </div>
                    </div>
                    <div className="flex flex-col mt-4 min-w-[90%] bg-slate-100 rounded-lg p-4 text-black">
                        <h2 className="text-lg font-semibold">
                            Assessment Details
                        </h2>
                        <p>Total Number of Items: {result.total_questions}</p>
                        <p>Correct Items: {result.correct_answers}</p>
                        {/* <p>Time Answered: {duration} minute/s</p> */}
                    </div>
                </div>
            )}

            {activeSection === "topicProficiencies" && (
                <div className="mt-4 flex flex-col">
                    {/* Proficiency Legends */}
                    <div className="mt-6 bg-slate-100 text-black rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">Proficiency Level Guide</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <h4 className="text-md font-medium mb-2">Grade Ranges</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                                    <span className="text-sm">0-49%: Beginner</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                                    <span className="text-sm">50-69%: Intermediate</span>
                                    </div>
                                    <div className="flex items-center">
                                    <div className="w-4 h-4 rounded-full bg-green-800 mr-2"></div>
                                    <span className="text-sm">70-100%: Advanced</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium mb-2">Proficiency Levels</h4>
                                <div className="space-y-2">
                                    <div className="flex items-start">
                                    <div className="w-4 h-4 rounded-sm bg-red-100 border border-red-500 mt-1 mr-2"></div>
                                    <div>
                                        <span className="text-sm font-medium">Beginner</span>
                                        <p className="text-xs text-gray-600">
                                        Basic understanding of concepts. Requires guidance to complete tasks.
                                        </p>
                                    </div>
                                    </div>
                                    <div className="flex items-start">
                                    <div className="w-4 h-4 rounded-sm bg-yellow-100 border border-yellow-500 mt-1 mr-2"></div>
                                    <div>
                                        <span className="text-sm font-medium">Intermediate</span>
                                        <p className="text-xs text-gray-600">Good understanding with occasional assistance needed.</p>
                                    </div>
                                    </div>
                                    <div className="flex items-start">
                                    <div className="w-4 h-4 rounded-sm bg-green-100 border border-green-800 mt-1 mr-2"></div>
                                    <div>
                                        <span className="text-sm font-medium">Advanced</span>
                                        <p className="text-xs text-gray-600">
                                        Strong understanding and ability to apply concepts independently.
                                        </p>
                                    </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-md font-medium mb-2">How to Interpret Your Results</h4>
                                <ul className="list-disc pl-5 text-sm space-y-1 text-gray-700">
                                    <li> Your <span className="font-medium">Grade</span> shows your performance in this assessment.</li>
                                    <li> Your <span className="font-medium">Proficiency Level</span> is determined by your grade percentage.</li>
                                    <li> Progress from one level to the next indicates significant improvement in your understanding.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {topicProficiencies.map((proficiency, index) => (
                        <div key={index} className="flex flex-col mt-2 min-w-[90%] bg-slate-100 text-black rounded-lg p-4 space-y-4">
                        <p className="text-lg font-semibold">Topic: {proficiency.topic_name}</p>
                        <div className="flex flex-col space-y-2">
                            <div className="flex flex-row justify-between items-center">
                            <p>Current Grade</p>
                            <div className="w-full bg-gray-200 rounded-full h-6 mx-2">
                                <div className={`h-6 rounded-full ${
                                    proficiency.grade < 50
                                    ? "bg-red-500"
                                    : proficiency.grade < 70
                                        ? "bg-yellow-500"
                                        : "bg-green-600"
                                }`}
                                style={{
                                    width: `${proficiency.grade}%`,
                                }}
                                ></div>
                            </div>
                            <span className="ml-2">{proficiency.grade}%</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Proficiency Level: {proficiency.current_level}</p>
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
            )}
        </div>
    );
};

export default IndividualAssessmentReport;
