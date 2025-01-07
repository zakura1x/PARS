import { usePage, useForm, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Pagination from "../../components/misc/Pagination";

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
    const [selectedTopics, setSelectedTopics] = useState([]); // Only IDs now
    const { data, setData, post, processing } = useForm({
        type: "",
        subject_id: selectedSubject,
        total_items: "",
        topics: [], // Only topic IDs
    });
    const [topics, setTopics] = useState(initialTopics?.data || []);

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

    useEffect(() => {
        if (Array.isArray(initialTopics?.data)) {
            setTopics(initialTopics.data); // Use the data property if available
        } else if (Array.isArray(initialTopics)) {
            setTopics(initialTopics); // Fallback for plain arrays
        }
    }, [initialTopics]);

    const handlePageChange = (url) => {
        if (url) {
            Inertia.get(url);
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
        post("/student-practice-assessments/generate/assessment", {
            onSuccess: () => {
                console.log("Assessment generated successfully");
            },
            onError: (e) => {
                console.error("Error generating assessment:", e);
            },
        });
    };

    return (
        <div>
            <h1>Practice Generator Form</h1>

            <form onSubmit={handleSubmit}>
                <label>Choose What type of assessment</label>
                <select
                    id="type"
                    value={data.type}
                    onChange={(e) => setData("type", e.target.value)}
                >
                    <option value="">Assessment Type</option>
                    <option value="proficiency">
                        Based on your Proficiency
                    </option>
                    <option value="criteria">
                        Based on Pre-defined criteria for the topic
                    </option>
                    <option value="exam">
                        Based on Examination (Simulate board exam)
                    </option>
                </select>

                <label>Choose your subject</label>
                <select
                    id="subject"
                    value={data.subject_id}
                    onChange={(e) => {
                        setData("subject_id", e.target.value);
                        handleSubjectChange(e);
                    }}
                >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                            {subject.name}
                        </option>
                    ))}
                </select>

                <label>Total Number of Items</label>
                <input
                    type="number"
                    id="total_items"
                    value={data.total_items}
                    onChange={(e) => setData("total_items", e.target.value)}
                    placeholder="Minimum of 1"
                />

                <div>
                    <label htmlFor="search">Search Topics:</label>
                    <input
                        type="text"
                        id="search"
                        value={search}
                        onChange={handleSearchChange}
                        placeholder="Search topics..."
                    />
                </div>

                {/* Topics Table containing name and id */}
                <div className="my-2 overflow-x-auto lg:mx-4">
                    <table className="table-md bg-white shadow-md rounded-md">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 text-sm">
                                <th className="py-3 px-4 text-left">Name</th>
                                <th className="py-3 px-4 text-left">Actions</th>
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
                    <Pagination
                        data={initialTopics}
                        onPageChange={handlePageChange}
                    />
                </div>

                <div>
                    <h2>Topics for assessment:</h2>
                    <div className="flex flex-wrap">
                        {selectedTopics.map((topicId) => (
                            <span
                                key={topicId}
                                className="badge bg-blue-500 text-white m-1 p-2 rounded"
                                onClick={() => handleRemoveTopic(topicId)}
                            >
                                Topic ID: {topicId} &times;
                            </span>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                    disabled={processing}
                >
                    Save
                </button>
            </form>
        </div>
    );
};

export default PracticeGeneratorForm;
