"use client";

import { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import { ClipLoader } from "react-spinners";

const QuestionEdit = () => {
    const { question, subjects, topics } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        subject_id: question.subject_id,
        topic_id: question.topic_id,
        user_id: question.user_id,
        purpose_type: question.purpose_type,
        difficulty: question.difficulty,
        question_text: question.question_text,
        options: question.options,
        correct_answer: question.correct_answer,
        weight: question.weight,
        attachment_path: question.attachment_path,
        is_used: question.is_used ?? false,
    });

    const [availableTopics, setAvailableTopics] = useState(topics);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (data.subject_id) {
            fetch(
                `/api/question-form-requirements?subject_id=${data.subject_id}`
            )
                .then((response) => response.json())
                .then((result) => {
                    setAvailableTopics(result.topics || []);
                })
                .catch((error) => {
                    console.error("Error fetching topics:", error);
                });
        } else {
            setAvailableTopics([]);
        }
    }, [data.subject_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...data.options];
        updatedOptions[index] = value;
        setData("options", updatedOptions);
    };

    const handleAddOption = () => {
        setData("options", [...data.options, ""]);
    };

    const handleRemoveOption = (index) => {
        setData((prevData) => {
            const updatedOptions = prevData.options.filter(
                (_, i) => i !== index
            );
            const removedOption = prevData.options[index];

            return {
                ...prevData,
                options: updatedOptions,
                correct_answer: prevData.correct_answer.filter(
                    (ans) => ans !== removedOption
                ),
            };
        });
    };

    const toggleCorrectAnswer = (option) => {
        if (data.correct_answer.includes(option)) {
            setData(
                "correct_answer",
                data.correct_answer.filter((ans) => ans !== option)
            );
        } else {
            setData("correct_answer", [...data.correct_answer, option]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/questions/${question.id}`, data, {
            onSuccess: () => {
                alert("Question successfully updated!");
            },
        });
    };

    return (
        <div className="min-h-screen bg-base-200 py-8 px-4">
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        max-height: 0;
                    }
                    to {
                        max-height: 4rem;
                    }
                }
                @keyframes slideUp {
                    from {
                        max-height: 4rem;
                    }
                    to {
                        max-height: 0;
                    }
                }
                .slide-down {
                    animation: slideDown 0.5s ease-out;
                }
                .slide-up {
                    animation: slideUp 0.5s ease-out;
                }
            `}</style>
            <div className="max-w-4xl mx-auto">
                <div className="text-sm breadcrumbs mb-6">
                    <ul>
                        <li>
                            <Link
                                href="/questionBank"
                                className="link link-hover"
                            >
                                Question List
                            </Link>
                        </li>
                        <li>Edit Question</li>
                    </ul>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="card bg-base-100 shadow-xl"
                >
                    <div className="card-body space-y-6">
                        <h2 className="card-title text-3xl">Edit Question</h2>

                        <div className="form-control relative">
                            <label className="cursor-pointer label justify-start space-x-3">
                                <span className="label-text">Is Used</span>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={data.is_used}
                                    onChange={(e) => {
                                        setData("is_used", e.target.checked);
                                        setIsAnimating(true);
                                        setTimeout(
                                            () => setIsAnimating(false),
                                            500
                                        );
                                    }}
                                />
                            </label>
                            <div
                                className={`absolute top-full left-0 right-0 overflow-hidden transition-all duration-500 ${
                                    isAnimating ? "max-h-16" : "max-h-0"
                                }`}
                            >
                                <div
                                    className={`p-2 rounded-md ${
                                        data.is_used
                                            ? "bg-success text-success-content"
                                            : "bg-error text-error-content"
                                    }`}
                                >
                                    {data.is_used
                                        ? "Question Enabled"
                                        : "Question Disabled"}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Subject</span>
                                </label>
                                <select
                                    name="subject_id"
                                    value={data.subject_id}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select a subject</option>
                                    {subjects.map((subject) => (
                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >
                                            {subject.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.subject_id && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.subject_id}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Topic</span>
                                </label>
                                <select
                                    name="topic_id"
                                    value={data.topic_id}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select a topic</option>
                                    {availableTopics.map((topic) => (
                                        <option key={topic.id} value={topic.id}>
                                            {topic.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.topic_id && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.topic_id}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Purpose Type
                                    </span>
                                </label>
                                <select
                                    name="purpose_type"
                                    value={data.purpose_type}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select the Purpose</option>
                                    <option value="practice">
                                        Practice Type
                                    </option>
                                    <option value="assessment">
                                        Assessment Type
                                    </option>
                                    <option value="examination">
                                        Examination Type
                                    </option>
                                </select>
                                {errors.purpose_type && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.purpose_type}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Difficulty
                                    </span>
                                </label>
                                <select
                                    name="difficulty"
                                    value={data.difficulty}
                                    onChange={handleInputChange}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select Difficulty</option>
                                    <option value="remembering">
                                        Remembering
                                    </option>
                                    <option value="understanding">
                                        Understanding
                                    </option>
                                    <option value="analyzing">Analyzing</option>
                                    <option value="evaluating">
                                        Evaluating
                                    </option>
                                    <option value="create">Creating</option>
                                </select>
                                {errors.difficulty && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.difficulty}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Score</span>
                                </label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={data.weight}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                />
                                {errors.weight && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.weight}
                                    </span>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">
                                        Attach Image or File (Optional)
                                    </span>
                                </label>
                                <input
                                    type="file"
                                    name="attachment_path"
                                    onChange={(e) =>
                                        setData(
                                            "attachment_path",
                                            e.target.files[0]
                                        )
                                    }
                                    className="file-input file-input-bordered w-full"
                                />
                                {errors.attachment_path && (
                                    <span className="text-error text-sm mt-1">
                                        {errors.attachment_path}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Question Text
                                </span>
                            </label>
                            <textarea
                                name="question_text"
                                value={data.question_text}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered w-full h-24"
                                placeholder="Enter the question text here..."
                            ></textarea>
                            {errors.question_text && (
                                <span className="text-error text-sm mt-1">
                                    {errors.question_text}
                                </span>
                            )}
                        </div>

                        <div className="form-control space-y-4">
                            <h3 className="text-lg font-semibold">Options</h3>
                            {data.options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                        type="checkbox"
                                        checked={data.correct_answer.includes(
                                            option
                                        )}
                                        onChange={() =>
                                            toggleCorrectAnswer(option)
                                        }
                                        className="checkbox checkbox-primary"
                                    />
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        className="input input-bordered flex-grow"
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveOption(index)
                                        }
                                        className="btn btn-error btn-square btn-sm"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="btn btn-primary btn-sm"
                            >
                                Add Option
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn btn-primary flex-1"
                            >
                                {processing ? (
                                    <ClipLoader size={20} color={"#fff"} />
                                ) : (
                                    "Save Question"
                                )}
                            </button>
                            <Link href="/questionBank" className="flex-1">
                                <button className="btn btn-outline btn-error w-full">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuestionEdit;
