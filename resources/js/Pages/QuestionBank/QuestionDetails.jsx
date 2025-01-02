import { Link, useForm, router, usePage } from "@inertiajs/react";
import React, { useState } from "react";

const QuestionDetails = () => {
    const { initialSubjects } = usePage().props;
    const [topics, setTopics] = useState([]);

    //Initiate Data
    const { data, setData, post, processing } = useForm({
        subject_id: "",
        topic_id: "",
        user_id: "",
        question_text: "",
        format_type: "Multiple Choice", // Default to Multiple Choice for now
        purpose: "",
        difficulty: "",
        options: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
        ],
        weight: 1,
        attachment: null,
        status: "active",
    });

    // Update form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);

        if (name === "subject_id") {
            fetchTopics(value);
        }
    };

    //Fetch topics
    const fetchTopics = (subjectId) => {
        if (!subjectId) {
            setTopics([]);
            return;
        }

        //Fetch the topics using Inertia
        router.get(
            `/questions/form/requirements`,
            { subject_id: subjectId },
            {
                onSuccess: (page) => {
                    setTopics(page.props.topics || []);
                },
                preserveScroll: true,
                only: [],
                preserveState: true,
            }
        );
    };

    //Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        //Post uri/url
        // post('/questions');
    };

    const purposes = ["practice", "assessment", "examination"];
    const difficulties = [
        "remembering",
        "understanding",
        "analyzing",
        "evaluating",
        "create",
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Breadcrumbs */}
            <div className="breadcrumbs text-sm">
                <ul>
                    <li>
                        <Link href="/questionBank">Question</Link>
                    </li>
                    <li className="text-gray-500">Add Question</li>
                </ul>
            </div>
            <form onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Add New Question</h2>

                {/* Subject, Topic */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label>Subject</label>
                        <select
                            name="subject_id"
                            value={data.subject_id || ""}
                            onChange={handleChange}
                            className="w-full border rounded-sm px-3 py-2"
                        >
                            <option value="">Select Subject</option>
                            {initialSubjects.map((subject) => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Topic</label>
                        <input
                            list="topics"
                            name="topic_id"
                            value={data.topic_id}
                            onChange={handleChange}
                            placeholder="Select a Topic"
                            className="w-full border rounded-sm px-3 py-2"
                        />
                        <datalist id="topics">
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.id}>
                                    {topic.name}
                                </option>
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* Purpose, Difficulty */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label>Purpose</label>
                        <select
                            name="purpose"
                            value={data.purpose}
                            onChange={handleChange}
                            className="w-full border rounded-sm px-3 py-2"
                        >
                            <option value="">Select Purpose</option>
                            {purposes.map((purpose, index) => (
                                <option key={index} value={purpose}>
                                    {purpose}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Difficulty</label>
                        <select
                            name="difficulty"
                            value={data.difficulty}
                            onChange={handleChange}
                            className="w-full border rounded-sm px-3 py-2"
                        >
                            <option value="">Select Difficulty</option>
                            {difficulties.map((difficulty, index) => (
                                <option key={index} value={difficulty}>
                                    {difficulty}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Question Text */}
                <div className="mb-4">
                    <label>Question Text</label>
                    <textarea
                        name="question_text"
                        value={data.question_text}
                        onChange={handleChange}
                        className="w-full border rounded-sm px-3 py-2"
                        rows="3"
                        placeholder="Enter your question here"
                    />
                </div>

                {/* Dynamic Options with Selectable Correct Answer */}
                <div className="mb-4">
                    <label>Options</label>
                    {data.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={option.isCorrect}
                                onChange={(e) =>
                                    handleOptionChange(
                                        index,
                                        "isCorrect",
                                        e.target.checked
                                    )
                                }
                                className="form-checkbox h-5 w-5"
                            />
                            <input
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={option.text}
                                onChange={(e) =>
                                    handleOptionChange(
                                        index,
                                        "text",
                                        e.target.value
                                    )
                                }
                                className="w-full border rounded-sm px-3 py-2 ml-2"
                            />
                        </div>
                    ))}
                </div>

                {/* File Upload */}
                <div className="mb-4">
                    <label>Attachment (Optional)</label>
                    <input
                        type="file"
                        onChange={handleChange}
                        value={data.attachment}
                        className="w-full border rounded-sm px-3 py-2"
                    />
                </div>

                {/* Weight and Status */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label>Weight</label>
                        <input
                            type="number"
                            name="weight"
                            value={data.weight}
                            onChange={handleChange}
                            min="1"
                            className="w-full border rounded-sm px-3 py-2"
                        />
                    </div>
                    <div>
                        <label>Status</label>
                        <select
                            name="status"
                            value={data.status}
                            onChange={handleChange}
                            className="w-full border rounded-sm px-3 py-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-4">
                    {/* <button
                        type="reset"
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-sm hover:bg-gray-400"
                    >
                        Reset
                    </button> */}
                    <button
                        type="submit"
                        className={`bg-green-600 text-white px-4 py-2 rounded ${
                            processing
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-green-700"
                        }`}
                        disabled={processing}
                    >
                        Save Question
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionDetails;
