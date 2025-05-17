import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
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

const EditAssessmentDialog = ({ isOpen, onClose, assessment, onSave }) => {
    const [formData, setFormData] = useState({
        title: assessment?.title || "",
        time_limit: assessment?.time_limit || 60,
        description: assessment?.description || "",
    });

    useEffect(() => {
        if (isOpen && assessment) {
            setFormData({
                title: assessment.title || "",
                time_limit: assessment.time_limit || 60,
                description: assessment.description || "",
            });
        }
    }, [isOpen, assessment]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "time_limit" ? Number.parseInt(value, 10) || 0 : value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">
                    Edit Assessment Details
                </h3>
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter assessment title"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="time_limit"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Time Limit (minutes)
                        </label>
                        <input
                            type="number"
                            id="time_limit"
                            name="time_limit"
                            value={formData.time_limit}
                            onChange={handleChange}
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter time limit in minutes"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter assessment description"
                        ></textarea>
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center transition-colors"
                    >
                        <X size={16} className="mr-1" /> Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center transition-colors"
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
    const [editAssessmentDialog, setEditAssessmentDialog] = useState(false);
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

    // const handleStartAssessment = () => {
    //     setDialogConfig((prev) => ({ ...prev, isLoading: true }));
    //     router.put(
    //         `/assessment/update/to/wait/${assessment.id}`,
    //         {},
    //         {
    //             onSuccess: () => {
    //                 setMessages({
    //                     success: "Assessment started successfully!",
    //                 });
    //                 setDialogConfig({
    //                     isOpen: false,
    //                     action: null,
    //                     isLoading: false,
    //                 });
    //             },
    //             onError: (error) => {
    //                 setMessages({
    //                     error: error.message || "Failed to start assessment",
    //                 });
    //                 setDialogConfig({
    //                     isOpen: false,
    //                     action: null,
    //                     isLoading: false,
    //                 });
    //             },
    //         }
    //     );
    // };
    const handleStartAssessment = (assessmentId) => {
        router.put(`/assessment/update/to/wait/${assessmentId}`);
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

    const handleSaveAssessment = (formData) => {
        router.post(
            `/assessment/update/${assessment.id}`,
            {
                title: formData.title,
                time_limit: formData.time_limit,
                description: formData.description,
            },
            {
                onSuccess: () => {
                    setMessages({
                        success: "Assessment details updated successfully!",
                    });
                    setEditAssessmentDialog(false);
                },
                onError: (error) => {
                    setMessages({
                        error:
                            error.message ||
                            "Failed to update assessment details",
                    });
                    setEditAssessmentDialog(false);
                },
            }
        );
    };

    const handleActionClick = (action) => {
        if (action === "edit") {
            setEditAssessmentDialog(true);
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
            <div className="p-4">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <h1 className="text-xl font-bold text-gray-800">
                            {assessment.title}
                        </h1>
                        {assessment.description && (
                            <p className="mt-2 text-gray-600">
                                {assessment.description}
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                        <div className="p-4">
                            <div className="text-sm font-medium text-gray-500">
                                Status
                            </div>
                            <div className="mt-1 font-semibold">
                                <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        assessment.status === "active"
                                            ? "bg-green-100 text-green-800"
                                            : assessment.status === "draft"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : assessment.status === "rejected"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                    {assessment.status || "Pending"}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="text-sm font-medium text-gray-500">
                                Time Limit
                            </div>
                            <div className="mt-1 font-semibold">
                                {assessment.time_limit || 60} minutes
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="text-sm font-medium text-gray-500">
                                Questions
                            </div>
                            <div className="mt-1 font-semibold">
                                {questions.length} questions
                            </div>
                        </div>
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
            {(messages.success || messages.error) && (
                <div className="p-4">
                    {messages.success && (
                        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md flex items-start">
                            <CheckCircle className="h-5 w-5 mr-3 mt-0.5" />
                            <div>
                                <p className="font-medium">
                                    {messages.success}
                                </p>
                                {messages.replacement && (
                                    <p className="mt-1 text-sm">
                                        {messages.replacement}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    {messages.error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-start">
                            <X className="h-5 w-5 mr-3 mt-0.5" />
                            <div>
                                <p className="font-medium">{messages.error}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="p-4 bg-white rounded-lg shadow-sm mb-4 flex justify-between items-center">
                <div className="flex space-x-2">
                    {/* Submit for approval */}
                    {showButtons.submit && (
                        <button
                            onClick={() => handleActionClick("submit")}
                            className="px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-md flex items-center transition-colors"
                            disabled={dialogConfig.isLoading}
                        >
                            <CheckCircle size={18} className="mr-2" />
                            <span>Submit for approval</span>
                        </button>
                    )}

                    {/* Start assessment */}
                    {showButtons.start && (
                        <button
                            onClick={() => handleActionClick("start")}
                            className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md flex items-center transition-colors"
                            disabled={dialogConfig.isLoading}
                        >
                            <Play size={18} className="mr-2" />
                            <span>Start assessment</span>
                        </button>
                    )}

                    {/* View Status */}
                    {showButtons.viewStatus && (
                        <button
                            onClick={() => handleActionClick("view-status")}
                            className="px-3 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-md flex items-center transition-colors"
                            disabled={dialogConfig.isLoading}
                        >
                            <Eye size={18} className="mr-2" />
                            <span>View status</span>
                        </button>
                    )}

                    {/* Edit Assessment */}
                    {showButtons.edit && (
                        <button
                            onClick={() => handleActionClick("edit")}
                            className="px-3 py-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-md flex items-center transition-colors"
                            disabled={dialogConfig.isLoading}
                        >
                            <Edit size={18} className="mr-2" />
                            <span>Edit assessment</span>
                        </button>
                    )}

                    {/* Copy Assessment */}
                    {showButtons.copy && (
                        <button
                            onClick={() => handleActionClick("copy")}
                            className="px-3 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-md flex items-center transition-colors"
                            disabled={dialogConfig.isLoading}
                        >
                            <Copy size={18} className="mr-2" />
                            <span>Copy assessment</span>
                        </button>
                    )}

                    {/* Delete Assessment */}
                    {showButtons.delete && (
                        <button
                            onClick={() => handleActionClick("delete")}
                            className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md flex items-center transition-colors"
                            disabled={dialogConfig.isLoading}
                        >
                            <Trash2 size={18} className="mr-2" />
                            <span>Delete assessment</span>
                        </button>
                    )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                    onClick={handleExpandAll}
                    className="px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md flex items-center transition-colors"
                    disabled={dialogConfig.isLoading}
                >
                    {expandAll ? (
                        <>
                            <ChevronUp size={18} className="mr-2" />
                            Collapse all
                        </>
                    ) : (
                        <>
                            <ChevronDown size={18} className="mr-2" />
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

            {/* Edit Assessment Dialog */}
            <EditAssessmentDialog
                isOpen={editAssessmentDialog}
                onClose={() => setEditAssessmentDialog(false)}
                assessment={assessment}
                onSave={handleSaveAssessment}
            />

            {/* Questions by Topic */}
            <div className="p-4 space-y-6">
                {Object.entries(groupedQuestions).map(
                    ([topicName, topicQuestions], topicIndex) => (
                        <div
                            key={topicIndex}
                            className="bg-white rounded-lg shadow-sm overflow-hidden"
                        >
                            {/* Topic Header */}
                            <div
                                className="p-4 bg-gray-50 border-b flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => toggleSection(topicName)}
                            >
                                <h2 className="font-bold text-lg text-gray-800 flex items-center">
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded-full mr-3 text-sm">
                                        {topicIndex + 1}
                                    </span>
                                    {topicName}
                                    <span className="ml-3 text-sm font-normal text-gray-500">
                                        ({topicQuestions.length} questions)
                                    </span>
                                </h2>
                                <button className="p-1 rounded-full hover:bg-gray-200 transition-colors">
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
                                        <div
                                            key={question.id}
                                            className="p-5 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-start">
                                                    <span className="font-medium mr-3 text-gray-500 mt-0.5">
                                                        {qIndex + 1}.
                                                    </span>
                                                    <span className="text-gray-800 font-medium">
                                                        {question.question_text}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-3 ml-4">
                                                    <span
                                                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                                                            question.difficulty ===
                                                            "remembering"
                                                                ? "bg-green-100 text-green-800"
                                                                : question.difficulty ===
                                                                  "understanding"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : question.difficulty ===
                                                                  "applying"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-purple-100 text-purple-800"
                                                        }`}
                                                    >
                                                        {question.difficulty}
                                                    </span>
                                                    <button
                                                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
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
                                                                size={18}
                                                            />
                                                        ) : (
                                                            <ChevronDown
                                                                size={18}
                                                            />
                                                        )}
                                                    </button>
                                                    {showButtons.replaceQuestion && (
                                                        <button
                                                            className={`p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors ${
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
                                                                size={18}
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Options - only show if question is expanded */}
                                            {expandedQuestions[question.id] && (
                                                <div className="ml-8 mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                                                    {question.options &&
                                                        question.options.map(
                                                            (
                                                                option,
                                                                oIndex
                                                            ) => (
                                                                <div
                                                                    key={oIndex}
                                                                    className={`flex items-center p-2 rounded-md ${
                                                                        isCorrectAnswer(
                                                                            question,
                                                                            option
                                                                        )
                                                                            ? "bg-green-50"
                                                                            : "hover:bg-gray-100"
                                                                    }`}
                                                                >
                                                                    <div
                                                                        className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${
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
                                                                                ? "font-medium text-green-800"
                                                                                : "text-gray-700"
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
