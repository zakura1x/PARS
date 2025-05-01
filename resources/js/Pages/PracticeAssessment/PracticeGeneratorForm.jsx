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
        flash: { message },
        config: assessmentConfig,
    } = usePage().props;

    const [selectedSubject, setSelectedSubject] = useState(
        initialSubjectId || ""
    );
    const [search, setSearch] = useState(initialSearch || "");
    const [recommendedTopics, setRecommendedTopics] = useState([]);
    const [isLoadingRecommendations, setIsLoadingRecommendations] =
        useState(false);
    const [showRecommendations, setShowRecommendations] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        subject_id: selectedSubject,
        total_items: assessmentConfig?.min_items || 10,
        topics: [],
        time_limit: assessmentConfig?.min_time || 15,
    });

    const [selectedTopics, setSelectedTopics] = useState(data.topics || []);
    const [topics, setTopics] = useState(
        initialTopics?.data || initialTopics || []
    );

    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (Array.isArray(initialTopics?.data)) {
            setTopics(initialTopics.data);
        } else if (Array.isArray(initialTopics)) {
            setTopics(initialTopics);
        }
    }, [initialTopics]);

    const fetchRecommendedTopics = async () => {
        if (!selectedSubject) return;

        setIsLoadingRecommendations(true);
        setShowRecommendations(true);
        try {
            const response = await axios.get(
                `/api/recommended-topics?subject_id=${selectedSubject}`
            );
            setRecommendedTopics(response.data.recommendedTopics);
        } catch (error) {
            console.error("Error fetching recommended topics:", error);
        } finally {
            setIsLoadingRecommendations(false);
        }
    };

    const handleSubjectChange = (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setData("subject_id", subjectId);
        setShowRecommendations(false); // Hide recommendations when subject changes
        if (subjectId) {
            router.get(
                `/student-practice-assessments/generator/form`,
                { subject_id: subjectId, search },
                { preserveState: true, preserveScroll: true }
            );
        } else {
            setTopics([]);
            setSelectedTopics([]);
            setData("topics", []);
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
            updateRecommendedSettings(newSelectedTopics);
        }
    };

    const handleRemoveTopic = (topicId) => {
        const updatedTopics = selectedTopics.filter((id) => id !== topicId);
        setSelectedTopics(updatedTopics);
        setData("topics", updatedTopics);
        updateRecommendedSettings(updatedTopics);
    };

    const updateRecommendedSettings = (topicIds) => {
        if (topicIds.length === 0) {
            setData({
                ...data,
                total_items: assessmentConfig.min_items,
                time_limit: assessmentConfig.min_time,
            });
            return;
        }

        const selectedTopicsData = topicIds.map((id) => {
            const topic = topics.find((t) => t.id === id);
            return {
                id,
                proficiency_level:
                    topic?.proficiency?.proficiency_level || "beginner",
            };
        });

        const recommendedItems = calculateRecommendedItems(selectedTopicsData);
        const recommendedTime = calculateRecommendedTime(selectedTopicsData);

        setData({
            ...data,
            total_items: recommendedItems,
            time_limit: recommendedTime,
        });
    };

    const calculateRecommendedItems = (topics) => {
        const baseItems = assessmentConfig.base_items_per_topic;
        const total = topics.reduce((sum, topic) => {
            const multiplier =
                assessmentConfig.proficiency_multipliers[
                    topic.proficiency_level
                ]?.items || 1.0;
            return sum + baseItems * multiplier;
        }, 0);

        return Math.min(
            Math.max(Math.round(total), assessmentConfig.min_items),
            assessmentConfig.max_items
        );
    };

    const calculateRecommendedTime = (topics) => {
        const baseTime = assessmentConfig.base_minutes_per_item;
        const total = topics.reduce((sum, topic) => {
            const multiplier =
                assessmentConfig.proficiency_multipliers[
                    topic.proficiency_level
                ]?.time || 1.0;
            return sum + baseTime * multiplier;
        }, 0);

        const totalTime = total * calculateRecommendedItems(topics);
        return Math.min(
            Math.max(Math.round(totalTime), assessmentConfig.min_time),
            assessmentConfig.max_time
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTopics.length === 0) {
            setData("topics", []);
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmSubmit = () => {
        setShowConfirmation(false);
        post("/student-practice-assessments/generate/assessment", {
            onSuccess: () => {},
            onError: (errors) => {
                console.error("Error generating assessment:", errors);
            },
        });
    };

    const handleCancelSubmit = () => {
        setShowConfirmation(false);
    };

    const addRecommendedTopic = (topicId) => {
        if (!selectedTopics.includes(topicId)) {
            const newSelectedTopics = [...selectedTopics, topicId];
            setSelectedTopics(newSelectedTopics);
            setData("topics", newSelectedTopics);
            updateRecommendedSettings(newSelectedTopics);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg mt-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                Practice Assessment Generator
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
                <div className="grid grid-cols-1 gap-6">
                    <SubjectSelect
                        subjects={subjects}
                        selectedSubject={data.subject_id}
                        onChange={handleSubjectChange}
                        error={errors.subject_id}
                    />
                </div>

                {/* Add button to fetch recommended topics */}
                {selectedSubject && (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={fetchRecommendedTopics}
                            className="btn btn-secondary"
                            disabled={isLoadingRecommendations}
                        >
                            {isLoadingRecommendations ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "Get Recommended Topics"
                            )}
                        </button>
                    </div>
                )}

                {/* Recommended Topics Section - only shown when showRecommendations is true */}
                {showRecommendations && (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex justify-between items-center">
                                <h2 className="card-title">
                                    Recommended Topics
                                </h2>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowRecommendations(false)
                                    }
                                    className="btn btn-sm btn-ghost"
                                >
                                    Close
                                </button>
                            </div>
                            {isLoadingRecommendations ? (
                                <div className="flex justify-center">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : recommendedTopics.length > 0 ? (
                                <>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Based on your proficiency levels
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {recommendedTopics.map((topic) => (
                                            <button
                                                key={topic.id}
                                                type="button"
                                                onClick={() =>
                                                    addRecommendedTopic(
                                                        topic.id
                                                    )
                                                }
                                                className={`badge badge-lg cursor-pointer ${
                                                    selectedTopics.includes(
                                                        topic.id
                                                    )
                                                        ? "badge-primary"
                                                        : "badge-outline"
                                                }`}
                                            >
                                                {topic.name} (
                                                {topic.proficiency_level})
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p>
                                    No recommended topics found for this
                                    subject.
                                </p>
                            )}
                        </div>
                    </div>
                )}

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">
                                Total Number of Items
                            </span>
                            <span className="label-text-alt">
                                {assessmentConfig.min_items}-
                                {assessmentConfig.max_items}
                            </span>
                        </label>
                        <input
                            type="number"
                            id="total_items"
                            value={data.total_items}
                            onChange={(e) =>
                                setData("total_items", e.target.value)
                            }
                            min={assessmentConfig.min_items}
                            max={assessmentConfig.max_items}
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
                            <span className="label-text">
                                Time Limit (minutes)
                            </span>
                            <span className="label-text-alt">
                                {assessmentConfig.min_time}-
                                {assessmentConfig.max_time}
                            </span>
                        </label>
                        <input
                            type="number"
                            id="time_limit"
                            value={data.time_limit}
                            onChange={(e) =>
                                setData("time_limit", e.target.value)
                            }
                            min={assessmentConfig.min_time}
                            max={assessmentConfig.max_time}
                            className="input input-bordered w-full"
                        />
                        {errors.time_limit && (
                            <span className="text-error text-sm">
                                {errors.time_limit}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={processing || selectedTopics.length === 0}
                >
                    {processing ? "Generating..." : "Generate Assessment"}
                </button>
            </form>
        </div>
    );
};

export default PracticeGeneratorForm;
