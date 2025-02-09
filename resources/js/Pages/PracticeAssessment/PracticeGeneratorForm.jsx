import { useState, useEffect } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import SubjectSelect from "../../components/PracticeAssessment/SubjectSelect";
import TopicSearch from "../../components/PracticeAssessment/TopicSearch";
import TopicList from "../../components/PracticeAssessment/TopicList";
import SelectedTopics from "../../components/PracticeAssessment/SelectedTopics";
import ConfirmationDialog from "../../components/PracticeAssessment/ConfirmationDialog";
import LoadingSpinner from "../../components/PracticeAssessment/LoadingSpinner";

const PracticeGeneratorForm = () => {
    const {
        subjects,
        topics: initialTopics,
        search: initialSearch,
        subjectId: initialSubjectId,
        flash: { message }, // Add flash message
    } = usePage().props;
    const [selectedSubject, setSelectedSubject] = useState(
        initialSubjectId || ""
    );
    const [search, setSearch] = useState(initialSearch || "");
    const { data, setData, post, processing, reset, errors } = useForm({
        type: "",
        subject_id: selectedSubject,
        total_items: "",
        topics: [],
        time_limit: "",
    });
    const [selectedTopics, setSelectedTopics] = useState(data.topics || []);
    const [topics, setTopics] = useState(initialTopics?.data || []);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (Array.isArray(initialTopics?.data)) {
            setTopics(initialTopics.data);
        } else if (Array.isArray(initialTopics)) {
            setTopics(initialTopics);
        }
    }, [initialTopics]);

    const handleSubjectChange = (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setData("subject_id", subjectId);
        if (subjectId) {
            router.get(
                `/student-practice-assessments/generator/form`,
                { subject_id: subjectId, search },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
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
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Practice Generator Form
            </h1>
            <hr className="border-t-2 border-gray-200 mb-6" />

            {message && (
                <div className="alert alert-error">
                    <span>{message}</span>
                </div>
            )}

            {showConfirmation && (
                <ConfirmationDialog
                    onConfirm={handleConfirmSubmit}
                    onCancel={handleCancelSubmit}
                />
            )}

            {processing && <LoadingSpinner />}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Assessment Type</span>
                        </label>
                        <select
                            id="type"
                            value={data.type}
                            onChange={(e) => setData("type", e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">Select Assessment Type</option>
                            <option value="proficiency">
                                Based on your Proficiency
                            </option>
                            <option value="exam">
                                Based on Examination (Simulate board exam)
                            </option>
                        </select>
                        {errors.type && (
                            <span className="text-error text-sm">
                                {errors.type}
                            </span>
                        )}
                    </div>

                    <SubjectSelect
                        subjects={subjects}
                        selectedSubject={data.subject_id}
                        onChange={handleSubjectChange}
                        error={errors.subject_id}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Total Number of Items
                            </span>
                        </label>
                        <input
                            type="number"
                            id="total_items"
                            value={data.total_items}
                            onChange={(e) =>
                                setData("total_items", e.target.value)
                            }
                            placeholder="Minimum of 1"
                            className="input input-bordered w-full"
                        />
                        {errors.total_items && (
                            <span className="text-error text-sm">
                                {errors.total_items}
                            </span>
                        )}
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Set time limit</span>
                        </label>
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
                            <span className="text-error text-sm">
                                {errors.time_limit}
                            </span>
                        )}
                    </div>
                </div>

                <TopicSearch search={search} onChange={handleSearchChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TopicList
                        topics={topics}
                        onTopicClick={handleTopicClick}
                    />
                    <SelectedTopics
                        selectedTopics={selectedTopics}
                        topics={topics}
                        onRemoveTopic={handleRemoveTopic}
                        error={errors.topics}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={processing}
                >
                    Generate the Assessment
                </button>
            </form>
        </div>
    );
};

export default PracticeGeneratorForm;
