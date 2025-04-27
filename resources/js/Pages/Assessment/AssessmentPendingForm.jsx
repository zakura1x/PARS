import React, { useState, useEffect } from "react";
import { Link, useForm, router } from "@inertiajs/react";
import { ChevronDown, ChevronUp, RefreshCw, X, Check } from "lucide-react";

const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Yes",
    cancelText = "No",
    isLoading = false,
    isDanger = false,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`px-4 py-2 text-white rounded hover:opacity-90 disabled:opacity-50 ${
                            isDanger ? "bg-red-600" : "bg-blue-600"
                        }`}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const EditTitleDialog = ({ isOpen, onClose, initialTitle, onSave }) => {
    const [title, setTitle] = useState(initialTitle);

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
        }
    }, [isOpen, initialTitle]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">
                    Edit Assessment Title
                </h3>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder="Enter new title"
                />
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                    >
                        <X size={16} className="mr-1" /> Cancel
                    </button>
                    <button
                        onClick={() => onSave(title)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    >
                        <Check size={16} className="mr-1" /> Save
                    </button>
                </div>
            </div>
        </div>
    );
};

const AssessmentPendingForm = ({ assessment, questions }) => {
    // State management
    const [expandedSections, setExpandedSections] = useState({});
    const [expandAll, setExpandAll] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [replacingQuestionId, setReplacingQuestionId] = useState(null);
    const [messages, setMessages] = useState({});
    const [comment, setComment] = useState("");
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

    // Initialize expanded states
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

    // Action handlers
    const handleApproveAssessment = () => {
        post(`/assessment/update/approve/${assessment.id}`, {
            comment,
            onSuccess: () => {
                setMessages({
                    success: "Assessment approved successfully!",
                });
            },
            onError: (error) => {
                setMessages({
                    error: error.message || "Failed to approve assessment",
                });
            },
        });
    };

    const handleDisapproveAssessment = () => {
        post(`/assessment/update/reject/${assessment.id}`, {
            comment,
            onSuccess: () => {
                setMessages({
                    success: "Assessment disapproved successfully!",
                });
            },
            onError: (error) => {
                setMessages({
                    error: error.message || "Failed to disapprove assessment",
                });
            },
        });
    };

    // Helper functions
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
        post(
            `/assessment/replace/question/program-head/${questionId}/${assessment.id}`,
            {
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
            }
        );
    };

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
                    <div className="bg-white p-2 rounded-md mt-1">
                        {assessment.status || "Pending"}
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

            {/* Expand/Collapse Button */}
            <div className="flex justify-end p-4 bg-gray-50 border-b">
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
                                                        {question.is_replacement && (
                                                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                                                (Replaced)
                                                            </span>
                                                        )}
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

                                            {/* Show original question if this is a replacement */}
                                            {question.is_replacement &&
                                                question.original_question &&
                                                expandedQuestions[
                                                    question.id
                                                ] && (
                                                    <div className="ml-6 mb-3 p-3 bg-gray-50 rounded border-l-4 border-yellow-400">
                                                        <div className="text-sm font-medium text-gray-700 mb-1">
                                                            Original Question:
                                                        </div>
                                                        <div className="text-gray-800">
                                                            {
                                                                question
                                                                    .original_question
                                                                    .question_text
                                                            }
                                                        </div>

                                                        {/* Optional: Show original options */}
                                                        {question
                                                            .original_question
                                                            .options && (
                                                            <div className="mt-2 ml-4 space-y-1">
                                                                {question.original_question.options.map(
                                                                    (
                                                                        option,
                                                                        optIndex
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                optIndex
                                                                            }
                                                                            className="flex items-center"
                                                                        >
                                                                            <div
                                                                                className={`w-3 h-3 rounded-full mr-2 ${
                                                                                    question.original_question.correct_answer.includes(
                                                                                        option
                                                                                    )
                                                                                        ? "bg-green-500"
                                                                                        : "bg-gray-300"
                                                                                }`}
                                                                            ></div>
                                                                            <span
                                                                                className={
                                                                                    question.original_question.correct_answer.includes(
                                                                                        option
                                                                                    )
                                                                                        ? "font-medium text-green-700"
                                                                                        : "text-gray-600"
                                                                                }
                                                                            >
                                                                                {
                                                                                    option
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </div>
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

            {/* Comment Box and Action Buttons */}
            <div className="p-4 bg-white border-t sticky bottom-0 shadow-lg">
                <div className="mb-4">
                    <label htmlFor="comment" className="block font-medium mb-2">
                        Comments
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="3"
                        placeholder="Enter your comments here..."
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={handleDisapproveAssessment}
                        disabled={processing}
                        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                        Disapprove Assessment
                    </button>
                    <button
                        onClick={handleApproveAssessment}
                        disabled={processing}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                    >
                        Approve Assessment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssessmentPendingForm;
