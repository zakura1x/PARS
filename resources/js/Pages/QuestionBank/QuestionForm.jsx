import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { ClipLoader } from "react-spinners";

const QuestionForm = ({ initialSubjects }) => {
    const { data, setData, post, processing, errors } = useForm({
        subject_id: "",
        topic_id: "",
        user_id: "",
        purpose_type: "",
        difficulty: "",
        question_text: "",
        options: [],
        correct_answer: [],
        weight: "1",
        attachment_path: "",
        status: "inactive",
    });

    const [topics, setTopics] = useState([]);
    const [isProcessing, setProcessing] = useState(false);

    useEffect(() => {
        if (data.subject_id) {
            fetch(
                `/api/question-form-requirements?subject_id=${data.subject_id}`
            )
                .then((response) => response.json())
                .then((result) => {
                    setTopics(result.topics || []);
                })
                .catch((error) => {
                    console.error("Error fetching topics:", error);
                });
        } else {
            setTopics([]);
        }
    }, [data.subject_id]);

    const handleAddOption = () => {
        setData("options", [...data.options, ""]);
    };

    const handleRemoveOption = (index) => {
        const updatedOptions = [...data.options];
        const removedOption = updatedOptions.splice(index, 1)[0];
        setData("options", updatedOptions);
        setData(
            "correct_answer",
            data.correct_answer.filter((ans) => ans !== removedOption)
        );
    };

    const handleOptionChange = (index, value) => {
        const updatedOptions = [...data.options];
        updatedOptions[index] = value;
        setData("options", updatedOptions);
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
        post("/addQuestion", {
            onStart: () => setProcessing(true),
            onSuccess: () => {
                alert("Question successfully added!");
                setProcessing(false);
            },
            onError: (e) => {
                setProcessing(false), console.log(e);
            },
        });
    };

    return (
        <div className="p-6 min-h-[90%]">
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <Link href="/questionBank">Question List</Link>
                    </li>
                    <li>
                        <a>Add a new Question</a>
                    </li>
                </ul>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-lg bg-background shadow"
            >
                <div className="w-full bg-black text-white rounded-t-lg">
                    <h1 className="text-lg mb-4 ml-2 font-medium p-2">
                        Add a new Question
                    </h1>
                </div>

                <div className="px-6 bg-background pb-4">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1">
                                Subject
                            </label>
                            <select
                                name="subject_id"
                                value={data.subject_id}
                                onChange={(e) =>
                                    setData("subject_id", e.target.value)
                                }
                                className="select select-bordered w-full bg-white"
                            >
                                <option value="">Select a subject</option>
                                {initialSubjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subject_id && (
                                <span className="text-red-500 text-sm">
                                    {errors.subject_id}
                                </span>
                            )}
                        </div>

                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1">
                                Topic
                            </label>
                            <select
                                name="topic_id"
                                value={data.topic_id}
                                onChange={(e) =>
                                    setData("topic_id", e.target.value)
                                }
                                className="select select-bordered w-full bg-white"
                            >
                                <option value="">Select a topic</option>
                                {topics.map((topic) => (
                                    <option key={topic.id} value={topic.id}>
                                        {topic.name}
                                    </option>
                                ))}
                            </select>
                            {errors.topic_id && (
                                <span className="text-red-500 text-sm">
                                    {errors.topic_id}
                                </span>
                            )}
                        </div>

                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1">
                                Purpose Type
                            </label>
                            <select
                                name="purpose_type"
                                value={data.purpose_type}
                                onChange={(e) =>
                                    setData("purpose_type", e.target.value)
                                }
                                className="select select-bordered w-full bg-white"
                            >
                                <option value="">Select the Purpose</option>
                                <option value="practice">Practice Type</option>
                                <option value="practice">
                                    Practice Question
                                </option>
                                <option value="assessment">
                                    Assessment Question
                                </option>
                            </select>
                            {errors.purpose_type && (
                                <span className="text-red-500 text-sm">
                                    {errors.purpose_type}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1">
                                Difficulty
                            </label>
                            <select
                                name="difficulty"
                                value={data.difficulty}
                                onChange={(e) =>
                                    setData("difficulty", e.target.value)
                                }
                                className="select select-bordered w-full bg-white"
                            >
                                <option value="">Select Difficulty</option>
                                <option value="remembering">Remembering</option>
                                <option value="understanding">
                                    Understanding
                                </option>
                                <option value="applying">Applying</option>
                                <option value="analyzing">Analyzing</option>
                                <option value="evaluating">Evaluating</option>
                                <option value="create">Creating</option>
                            </select>
                            {errors.difficulty && (
                                <span className="text-red-500 text-sm">
                                    {errors.difficulty}
                                </span>
                            )}
                        </div>

                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1">
                                Score
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={data.weight}
                                onChange={(e) =>
                                    setData("weight", e.target.value)
                                }
                                className="input input-bordered w-full bg-white"
                            />
                            {errors.weight && (
                                <span className="text-red-500 text-sm">
                                    {errors.weight}
                                </span>
                            )}
                        </div>

                        <div className="mb-4 w-full">
                            <label className="block text-sm font-medium mb-1">
                                Attach Image or File (Optional)
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
                                className="input input-bordered w-full bg-white"
                            />
                            {errors.attachment_path && (
                                <span className="text-red-500 text-sm">
                                    {errors.attachment_path}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Question Text
                        </label>
                        <textarea
                            name="question_text"
                            value={data.question_text}
                            onChange={(e) =>
                                setData("question_text", e.target.value)
                            }
                            className="textarea textarea-bordered w-full bg-white"
                        ></textarea>
                        {errors.question_text && (
                            <span className="text-red-500 text-sm">
                                {errors.question_text}
                            </span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={(e) => setData("status", e.target.value)}
                            className="select select-bordered w-full bg-white"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                        {errors.status && (
                            <span className="text-red-500 text-sm">
                                {errors.status}
                            </span>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Options
                        </label>
                        {data.options.map((option, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    checked={data.correct_answer.includes(
                                        option
                                    )}
                                    onChange={() => toggleCorrectAnswer(option)}
                                    className="mr-2"
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
                                    className="input input-bordered w-full mr-2 bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="btn btn-error"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddOption}
                            className="btn btn-primary mt-2"
                        >
                            Add Option
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row justify-between lg:justify-center lg:space-x-4 lg:items-center">
                        <div className="mt-4 w-full lg:w-[20%]">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="btn w-full bg-primary border-none text-white hover:bg-accent"
                            >
                                {isProcessing ? (
                                    <ClipLoader size={20} color={"#fff"} />
                                ) : (
                                    "Save Question"
                                )}
                            </button>
                        </div>
                        <div className="mt-4 w-full lg:w-[20%]">
                            <Link href="/questionBank">
                                <button className="btn btn-error hover:bg-red-500 w-full">
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm;
