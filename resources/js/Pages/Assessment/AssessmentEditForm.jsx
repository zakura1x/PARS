import React, { useState, useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronUp,
    RefreshCw,
    CheckCircle,
    Play,
    Eye,
    Edit,
    Copy,
    Trash2,
} from "lucide-react";

const AssessmentReview = ({ assessment, questions }) => {
    // Initialize all sections as expanded by default
    const [expandedSections, setExpandedSections] = useState({});
    const [expandAll, setExpandAll] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [replacingQuestionId, setReplacingQuestionId] = useState(null);
    const [messages, setMessages] = useState({});
    const { post, processing } = useForm({});

    // Group questions by topic
    const groupedQuestions = questions.reduce((acc, question) => {
        const topicName = question.topic.name;
        if (!acc[topicName]) {
            acc[topicName] = [];
        }
        acc[topicName].push(question);
        return acc;
    }, {});

    // Initialize expanded states when component mounts
    useEffect(() => {
        const initialExpandedSections = {};
        const initialExpandedQuestions = {};

        Object.keys(groupedQuestions).forEach((topic) => {
            initialExpandedSections[topic] = true;
            groupedQuestions[topic].forEach((question) => {
                initialExpandedQuestions[question.id] = true;
            });
        });

        setExpandedSections(initialExpandedSections);
        setExpandedQuestions(initialExpandedQuestions);
    }, []);

    const toggleSection = (sectionName) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    const handleExpandAll = () => {
        const newState = !expandAll;
        setExpandAll(newState);

        const newExpandedSections = {};
        Object.keys(groupedQuestions).forEach((topic) => {
            newExpandedSections[topic] = newState;
        });
        setExpandedSections(newExpandedSections);
    };

    const toggleQuestion = (questionId) => {
        setExpandedQuestions((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    const handleReplaceQuestion = (questionId) => {
        setReplacingQuestionId(questionId);

        post(`/assessment/replace-question/${questionId}/${assessment.id}`, {
            preserveScroll: true,
            onSuccess: (response) => {
                setMessages({
                    success: "Question replaced successfully!",
                    replacement: response.props.replacement,
                });
                setReplacingQuestionId(null);
            },
            onError: (err) => {
                setMessages({
                    error: err.message || "Failed to replace question.",
                });
                setReplacingQuestionId(null);
            },
        });
    };

    // Helper function to check if an option is correct
    const isCorrectAnswer = (question, option) => {
        return question.correct_answer.includes(option);
    };

    return (
        <div className="bg-gray-100">
            {/* Assessment Info */}
            <div className="p-4 flex space-x-4">
                <div className="bg-green-200 p-3 rounded-md flex-1">
                    <div className="text-sm font-medium uppercase">
                        ASSESSMENT TITLE
                    </div>
                    <div className="bg-white p-2 rounded-md mt-1">
                        {assessment.title}
                    </div>
                </div>
                <div className="bg-green-200 p-3 rounded-md w-64">
                    <div className="text-sm font-medium uppercase">STATUS</div>
                    <div className="bg-white p-2 rounded-md mt-1 text-transform: uppercase">
                        {assessment.status}
                    </div>
                </div>
            </div>

            {/* Messages */}
            {messages.success && (
                <div className="p-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {messages.success}
                    </div>
                </div>
            )}
            {messages.error && (
                <div className="p-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {messages.error}
                    </div>
                </div>
            )}

            {/* Assessment Actions */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                <div className="flex space-x-2">
                    {/* Submit for approval */}
                    <button
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md relative group"
                        title="Submit for approval"
                    >
                        <CheckCircle size={20} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Submit for approval
                        </span>
                    </button>

                    {/* Start the assessment */}
                    <button
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md relative group"
                        title="Start assessment"
                    >
                        <Play size={20} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Start assessment
                        </span>
                    </button>

                    {/* View Status */}
                    <button
                        className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md relative group"
                        title="View status"
                    >
                        <Eye size={20} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            View status
                        </span>
                    </button>

                    {/* Edit Assessment details */}
                    <button
                        className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md relative group"
                        title="Edit assessment"
                    >
                        <Edit size={20} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Edit assessment
                        </span>
                    </button>

                    {/* Copy Assessment */}
                    <button
                        className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md relative group"
                        title="Copy assessment"
                    >
                        <Copy size={20} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Copy assessment
                        </span>
                    </button>

                    {/* Delete Assessment */}
                    <button
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md relative group"
                        title="Delete assessment"
                    >
                        <Trash2 size={20} />
                        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            Delete assessment
                        </span>
                    </button>
                </div>

                {/* Expand/Collapse Button (kept on the right) */}
                <button
                    onClick={handleExpandAll}
                    className="text-sm text-gray-600 hover:underline flex items-center"
                >
                    {expandAll ? (
                        <>
                            <ChevronUp size={16} className="mr-1" />
                            Collapse all
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} className="mr-1" />
                            Expand all
                        </>
                    )}
                </button>
            </div>

            {/* Questions by Topic */}
            <div className="p-4 space-y-4">
                {Object.entries(groupedQuestions).map(
                    ([topicName, topicQuestions], topicIndex) => (
                        <div
                            key={topicIndex}
                            className="bg-white rounded-md shadow overflow-hidden"
                        >
                            {/* Topic Header */}
                            <div
                                className="p-4 bg-white border-b flex justify-between items-center cursor-pointer"
                                onClick={() => toggleSection(topicName)}
                            >
                                <h2 className="font-bold text-lg">
                                    {topicName}
                                </h2>
                                <button>
                                    {expandedSections[topicName] ? (
                                        <ChevronUp size={20} />
                                    ) : (
                                        <ChevronDown size={20} />
                                    )}
                                </button>
                            </div>

                            {/* Questions */}
                            {expandedSections[topicName] && (
                                <div className="divide-y">
                                    {topicQuestions.map((question, qIndex) => (
                                        <div key={question.id} className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center">
                                                    <span className="font-medium mr-2">
                                                        {qIndex + 1}.
                                                    </span>
                                                    <span>
                                                        {question.question_text}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span
                                                        className={`px-2 py-1 text-xs rounded ${
                                                            question.difficulty ===
                                                            "remembering"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-green-200 text-green-800"
                                                        }`}
                                                    >
                                                        {question.difficulty}
                                                    </span>
                                                    <button
                                                        className="text-gray-400 hover:text-gray-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleQuestion(
                                                                question.id
                                                            );
                                                        }}
                                                    >
                                                        {expandedQuestions[
                                                            question.id
                                                        ] ? (
                                                            <ChevronUp
                                                                size={16}
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={16}
                                                            />
                                                        )}
                                                    </button>
                                                    <button
                                                        className={`text-gray-400 hover:text-gray-600 ${
                                                            replacingQuestionId ===
                                                            question.id
                                                                ? "animate-spin"
                                                                : ""
                                                        }`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReplaceQuestion(
                                                                question.id
                                                            );
                                                        }}
                                                        disabled={
                                                            replacingQuestionId ===
                                                                question.id ||
                                                            processing
                                                        }
                                                    >
                                                        <RefreshCw size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Options - only show if question is expanded */}
                                            {expandedQuestions[question.id] && (
                                                <div className="ml-6 space-y-2">
                                                    {question.options &&
                                                        question.options.map(
                                                            (
                                                                option,
                                                                oIndex
                                                            ) => (
                                                                <div
                                                                    key={oIndex}
                                                                    className="flex items-center space-x-3"
                                                                >
                                                                    <div
                                                                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                                                                            isCorrectAnswer(
                                                                                question,
                                                                                option
                                                                            )
                                                                                ? "bg-green-600 border-green-600"
                                                                                : "border-gray-300"
                                                                        }`}
                                                                    >
                                                                        {isCorrectAnswer(
                                                                            question,
                                                                            option
                                                                        ) && (
                                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                        )}
                                                                    </div>
                                                                    <span
                                                                        className={
                                                                            isCorrectAnswer(
                                                                                question,
                                                                                option
                                                                            )
                                                                                ? "font-medium text-green-700"
                                                                                : ""
                                                                        }
                                                                    >
                                                                        {option}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default AssessmentReview;
