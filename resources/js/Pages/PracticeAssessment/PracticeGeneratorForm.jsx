import { usePage, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "../../components/misc/Pagination";
import LoadingSpinner from "../../components/misc/LoadingSpinner";

const PracticeGeneratorForm = () => {
    const {
        subjects,
        topics: initialTopics,
        search: initialSearch,
        subjectId: initialSubjectId,
    } = usePage().props;
    const [selectedSubject, setSelectedSubject] = useState(
        initialSubjectId || ""
    );
    const [search, setSearch] = useState(initialSearch || "");
    const { data, setData, post, processing, reset, errors } = useForm({
        type: "",
        subject_id: selectedSubject,
        total_items: "",
        topics: [], // Only topic IDs
        time_limit: "",
    });
    const [selectedTopics, setSelectedTopics] = useState(data.topics || []); // Initialize with form data topics
    const [topics, setTopics] = useState(initialTopics?.data || []);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubjectChange = (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setData("subject_id", subjectId);

        // Fetch topics for the selected subject
        if (subjectId) {
            router.get(
                `/student-practice-assessments/generator/form`,
                { subject_id: subjectId, search },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const uniqueTopics = Array.from(
        new Map(topics.map((topic) => [topic.id, topic])).values()
    );

    useEffect(() => {
        if (Array.isArray(initialTopics?.data)) {
            setTopics(initialTopics.data); // Use the data property if available
        } else if (Array.isArray(initialTopics)) {
            setTopics(initialTopics); // Fallback for plain arrays
        }
    }, [initialTopics]);

    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                { subject_id: selectedSubject, search: value },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Fetch topics for the selected subject with search query
        if (selectedSubject) {
            router.get(
                `/student-practice-assessments/generator/form`,
                { subject_id: selectedSubject, search: value },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const handleTopicClick = (topic) => {
        if (!selectedTopics.includes(topic.id)) {
            const newSelectedTopics = [...selectedTopics, topic.id];
            setSelectedTopics(newSelectedTopics);
            setData("topics", newSelectedTopics);
        }
    };

    const handleRemoveTopic = (topicId) => {
        const updatedTopics = selectedTopics.filter((id) => id !== topicId);
        setSelectedTopics(updatedTopics);
        setData("topics", updatedTopics);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmation(false);
        post("/student-practice-assessments/generate/assessment", {
            onSuccess: () => {},
            onError: (e) => {
                console.error("Error generating assessment:", e);
            },
        });
    };

    const handleCancelSubmit = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="m-4 p-6 rounded-lg bg-white">
            <h1 className="text-2xl font-bold mb-4">Practice Generator Form</h1>
            <hr className="border-t-2 border-black my-4" />
            {/* Confirmation Dialog */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg m-4">
                        <p className="mb-4">
                            Are you sure you want to create this assessment?
                            This will affect your overall Grade.
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="btn btn-error mr-2"
                                onClick={handleCancelSubmit}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn bg-green-500 border-none text-white"
                                onClick={handleConfirmSubmit}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Loading Spinner */}
            {processing && <LoadingSpinner />}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-col">
                        <label className="block mb-2">
                            Choose What type of assessment
                        </label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="select select-bordered w-full bg-transparent"
                        >
                            <option value="">Assessment Type</option>
                            <option value="proficiency">
                                Based on your Proficiency
                            </option>
                            {/* <option value="criteria">
                                Based on Pre-defined criteria for the topic
                            </option> */}
                            <option value="exam">
                                Based on Examination (Simulate board exam)
                            </option>
                        </select>
                        {errors.type && (
                            <span className="text-red-500 text-sm">
                                {errors.type}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <label className="block mb-2">
                            Choose your subject
                        </label>
                        <select
                            id="subject"
                            value={data.subject_id}
                            onChange={(e) => {
                                setData("subject_id", e.target.value);
                                handleSubjectChange(e);
                            }}
                            className="select select-bordered w-full bg-transparent"
                        >
                            <option value="">Select a subject</option>
                            {subjects.map((subject) => (
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
                </div>
                <div className="flex flex-row space-x-4">
                    <div className="flex flex-col">
                        <label className="block mb-2">
                            Total Number of Items
                        </label>
                        <input
                            type="number"
                            id="total_items"
                            value={data.total_items}
                            onChange={(e) =>
                                setData("total_items", e.target.value)
                            }
                            placeholder="Minimum of 1"
                            className="input input-bordered w-full bg-transparent"
                        />
                        {errors.total_items && (
                            <span className="text-red-500 text-sm">
                                {errors.total_items}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="block mb-2">Set time limit</label>
                        <input
                            type="text"
                            id="time_limit"
                            value={data.time_limit}
                            onChange={(e) =>
                                setData("time_limit", e.target.value)
                            }
                            list="timeLimitOptions"
                            placeholder="Select or enter time in minutes"
                            className="input input-bordered w-full"
                        />
                        <datalist id="timeLimitOptions">
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </datalist>
                        {errors.time_limit && (
                            <span className="text-red-500 text-sm">
                                {errors.time_limit}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-row space-x-4">
                    <div>
                        <label htmlFor="Topics" className="block mb-2">
                            Search Topics:
                        </label>
                        <input
                            type="text"
                            id="search"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search topics..."
                            className="input input-bordered w-full"
                        />
                    </div>
                </div>

                {/* Topics Table containing name and id */}
                <div className="my-2 overflow-x-auto lg:mx-4 max-h-96">
                    <table className="table w-full bg-white shadow-md rounded-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 text-sm">
                                <th className="py-3 px-4 text-left">Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(topics) && topics.length > 0 ? (
                                topics.map((topic) => (
                                    <tr
                                        key={topic.id}
                                        className="border-b text-gray-700 cursor-pointer hover:bg-gray-50"
                                        onClick={() => handleTopicClick(topic)}
                                    >
                                        <td className="py-3 px-4">
                                            {topic.name}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="2"
                                        className="text-center py-6 text-gray-500"
                                    >
                                        No topics found...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">
                        Topics for assessment:
                    </h2>
                    <div className="flex flex-wrap">
                        {selectedTopics.map((topicId) => {
                            const topic = topics.find((t) => t.id === topicId);
                            return (
                                <span
                                    key={topicId}
                                    onClick={() => handleRemoveTopic(topicId)}
                                    className="badge badge-accent cursor-pointer"
                                >
                                    {topic ? `${topic.name}` : `${topicId}`}{" "}
                                    &times;
                                </span>
                            );
                        })}
                    </div>
                    {errors.topics && (
                        <span className="text-red-500 text-sm">
                            Please include a topic to generate the assessment
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn bg-black w-full hover:bg-green-800 hover:text-white"
                    disabled={processing}
                >
                    Generate the Assessment
                </button>
            </form>
        </div>
    );
};

export default PracticeGeneratorForm;
