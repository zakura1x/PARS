import React, { useState, useEffect } from "react";
import { Link, useForm, router } from "@inertiajs/react";
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
    X,
    Check,
} from "lucide-react";

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

const AssessmentReview = ({ assessment, questions }) => {
    // State management
    const [expandedSections, setExpandedSections] = useState({});
    const [expandAll, setExpandAll] = useState(true);
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [replacingQuestionId, setReplacingQuestionId] = useState(null);
    const [messages, setMessages] = useState({});
    const [dialogConfig, setDialogConfig] = useState({
        isOpen: false,
        action: null,
        isLoading: false,
    });
    const [editTitleDialog, setEditTitleDialog] = useState(false);
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

    // Button visibility based on status
    const showButtons = {
        submit: assessment.status === "draft",
        start: assessment.status === "active",
        viewStatus: ["on_going", "completed"].includes(assessment.status),
        edit: assessment.status === "draft",
        copy: assessment.status === "rejected",
        delete: assessment.status === "draft",
        replaceQuestion: assessment.status === "draft",
    };

    // Action handlers
    const handleSubmitForApproval = () => {
        setDialogConfig((prev) => ({ ...prev, isLoading: true }));
        router.put(
            `/assessment/update/approval/${assessment.id}`,
            {},
            {
                onSuccess: () => {
                    setMessages({
                        success:
                            "Assessment submitted for approval successfully!",
                    });
                    setDialogConfig({
                        isOpen: false,
                        action: null,
                        isLoading: false,
                    });
                },
                onError: (error) => {
                    setMessages({
                        error: error.message || "Failed to submit for approval",
                    });
                    setDialogConfig({
                        isOpen: false,
                        action: null,
                        isLoading: false,
                    });
                },
            }
        );
    };

    const handleStartAssessment = () => {
        setDialogConfig((prev) => ({ ...prev, isLoading: true }));
        router.put(
            `/api/assessments/${assessment.id}/start`,
            {},
            {
                onSuccess: () => {
                    setMessages({
                        success: "Assessment started successfully!",
                    });
                    setDialogConfig({
                        isOpen: false,
                        action: null,
                        isLoading: false,
                    });
                },
                onError: (error) => {
                    setMessages({
                        error: error.message || "Failed to start assessment",
                    });
                    setDialogConfig({
                        isOpen: false,
                        action: null,
                        isLoading: false,
                    });
                },
            }
        );
    };

    const handleDeleteAssessment = () => {
        setDialogConfig((prev) => ({ ...prev, isLoading: true }));
        router.delete(`/api/assessments/${assessment.id}`, {
            onSuccess: () => {
                router.visit("/assessments");
            },
            onError: (error) => {
                setMessages({
                    error: error.message || "Failed to delete assessment",
                });
                setDialogConfig({
                    isOpen: false,
                    action: null,
                    isLoading: false,
                });
            },
        });
    };

    const handleCopyAssessment = () => {
        setDialogConfig((prev) => ({ ...prev, isLoading: true }));
        router.post(
            `/assessment/copy/${assessment.id}`,
            {},
            {
                onSuccess: () => {
                    setMessages({ success: "Assessment copied successfully!" });
                    setDialogConfig({
                        isOpen: false,
                        action: null,
                        isLoading: false,
                    });
                },
                onError: (error) => {
                    setMessages({
                        error: error.message || "Failed to copy assessment",
                    });
                    setDialogConfig({
                        isOpen: false,
                        action: null,
                        isLoading: false,
                    });
                },
            }
        );
    };

    const handleViewStatus = () => {
        router.visit(`/assessment/${assessment.id}/results`);
    };

    const handleSaveTitle = (newTitle) => {
        router.post(
            `/assessment/update/title/${assessment.id}`,
            {
                title: newTitle,
            },
            {
                onSuccess: () => {
                    setMessages({
                        success: "Assessment title updated successfully!",
                    });
                    setEditTitleDialog(false);
                },
                onError: (error) => {
                    setMessages({
                        error: error.message || "Failed to update title",
                    });
                    setEditTitleDialog(false);
                },
            }
        );
    };

    const handleActionClick = (action) => {
        if (action === "edit") {
            setEditTitleDialog(true);
            return;
        }

        if (action === "view-status") {
            handleViewStatus();
            return;
        }

        setDialogConfig({
            isOpen: true,
            action,
            isLoading: false,
        });
    };

    const handleConfirm = () => {
        switch (dialogConfig.action) {
            case "submit":
                handleSubmitForApproval();
                break;
            case "start":
                handleStartAssessment();
                break;
            case "delete":
                handleDeleteAssessment();
                break;
            case "copy":
                handleCopyAssessment();
                break;
            default:
                setDialogConfig({
                    isOpen: false,
                    action: null,
                    isLoading: false,
                });
        }
    };

    const handleCancel = () => {
        setDialogConfig({ isOpen: false, action: null, isLoading: false });
    };

    // Dialog configurations
    const dialogMessages = {
        submit: {
            title: "Submit for Approval",
            message:
                "Are you sure you want to send this to the program head for approval?",
            confirmText: "Submit",
        },
        start: {
            title: "Start Assessment",
            message:
                "This will make the assessment available to students. Are you sure?",
            confirmText: "Start",
        },
        delete: {
            title: "Delete Assessment",
            message:
                "This will permanently delete the assessment. Are you sure?",
            confirmText: "Delete",
            isDanger: true,
        },
        copy: {
            title: "Copy Assessment",
            message:
                "This will create a duplicate of this assessment. Are you sure?",
            confirmText: "Copy",
        },
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

            {/* Program Head Comments */}
            {assessment.comments && (
                <div className="p-4">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-blue-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Program Head Comments
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>{assessment.comments}</p>
                                </div>
                                {assessment.commented_at && (
                                    <div className="mt-1 text-xs text-blue-600">
                                        Commented on:{" "}
                                        {new Date(
                                            assessment.commented_at
                                        ).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Action Buttons */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                <div className="flex space-x-2">
                    {/* Submit for approval */}
                    {showButtons.submit && (
                        <button
                            onClick={() => handleActionClick("submit")}
                            className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md relative group"
                            disabled={dialogConfig.isLoading}
                        >
                            <CheckCircle size={20} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Submit for approval
                            </span>
                        </button>
                    )}

                    {/* Start assessment */}
                    {showButtons.start && (
                        <button
                            onClick={() => handleActionClick("start")}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md relative group"
                            disabled={dialogConfig.isLoading}
                        >
                            <Play size={20} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Start assessment
                            </span>
                        </button>
                    )}

                    {/* View Status */}
                    {showButtons.viewStatus && (
                        <button
                            onClick={() => handleActionClick("view-status")}
                            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-md relative group"
                            disabled={dialogConfig.isLoading}
                        >
                            <Eye size={20} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                View status
                            </span>
                        </button>
                    )}

                    {/* Edit Assessment */}
                    {showButtons.edit && (
                        <button
                            onClick={() => handleActionClick("edit")}
                            className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-md relative group"
                            disabled={dialogConfig.isLoading}
                        >
                            <Edit size={20} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Edit assessment
                            </span>
                        </button>
                    )}

                    {/* Copy Assessment */}
                    {showButtons.copy && (
                        <button
                            onClick={() => handleActionClick("copy")}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-md relative group"
                            disabled={dialogConfig.isLoading}
                        >
                            <Copy size={20} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Copy assessment
                            </span>
                        </button>
                    )}

                    {/* Delete Assessment */}
                    {showButtons.delete && (
                        <button
                            onClick={() => handleActionClick("delete")}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md relative group"
                            disabled={dialogConfig.isLoading}
                        >
                            <Trash2 size={20} />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Delete assessment
                            </span>
                        </button>
                    )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={handleExpandAll}
                    className="text-sm text-gray-600 hover:underline flex items-center"
                    disabled={dialogConfig.isLoading}
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

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={dialogConfig.isOpen}
                onClose={handleCancel}
                onConfirm={handleConfirm}
                isLoading={dialogConfig.isLoading}
                {...dialogMessages[dialogConfig.action]}
            />

            {/* Edit Title Dialog */}
            <EditTitleDialog
                isOpen={editTitleDialog}
                onClose={() => setEditTitleDialog(false)}
                initialTitle={assessment.title}
                onSave={handleSaveTitle}
            />

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
                                                    {showButtons.replaceQuestion && (
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
                                                            <RefreshCw
                                                                size={16}
                                                            />
                                                        </button>
                                                    )}
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
