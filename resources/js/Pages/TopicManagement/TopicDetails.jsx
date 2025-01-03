import React, { useState } from "react";
import { GiNotebook } from "react-icons/gi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link, usePage, useForm, router } from "@inertiajs/react";
//import { debounce } from "lodash";
import AddTopicsModal from "../../components/TopicManagement/AddTopicsModal";
import AddSubtopicsModal from "../../components/TopicManagement/AddSubtopicsModal";

const TableDetails = () => {
    const { topicMaster, topics: topicsData, subject } = usePage().props;

    // Ensure topics exist and sort by pivot.order
    const [topics, setTopics] = useState(
        (topicsData || []).sort((a, b) => a.pivot.order - b.pivot.order)
    );

    const [showModal, setShowModal] = useState(false);
    const [showSubtopicModal, setShowSubtopicModal] = useState(false);
    const [currentSubtopics, setCurrentSubtopics] = useState([]);
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

    //Loading states
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, reset, errors } = useForm({
        name: "",
        subject_id: subject.id,
    });

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleOpenSubtopicModal = (index) => {
        setSelectedTopicIndex(index);
        setCurrentSubtopics([...topics[index].subtopics]); // Set the subtopics for the selected topic
        setShowSubtopicModal(true);
    };

    const handleCloseSubtopicModal = () => {
        setShowSubtopicModal(false);
        setSelectedTopicIndex(null);
    };

    const handleSaveSubtopics = (updatedSubtopics) => {
        const updatedData = [...topics];
        updatedData[selectedTopicIndex].subtopics = updatedSubtopics;
        setTopics(updatedData); // Update state with new subtopics
        handleCloseSubtopicModal();
    };

    const handleSaveTopics = (newTopicName) => {
        // Update the form data with the new topic name
        console.log(newTopicName);
        setData({
            ...data,
            name: newTopicName, // Set the name to the new topic name
        });

        console.log("Saving topic with data:", data); // Log to see the form data

        post(`/topics/${topicMaster.id}/add-topics`, data, {
            onSuccess: () => {
                reset(); // Reset form data
                setShowModal(false); // Close the modal
                // Optionally reload the page if you want to reflect changes
                // router.reload();
            },
            onError: (errors) => {
                console.error(errors); // Handle errors
            },
        });
    };

    // const updateBackEnd =
    //     ((updatedOrder) => {
    //         router.post(
    //             `/topics/${topicMaster.id}/reorder`,
    //             {
    //                 topics: updatedOrder,
    //             },
    //             {
    //                 onSuccess: () => {
    //                     setIsLoading(false);
    //                 },
    //                 onError: (errors) => {
    //                     console.error(errors);
    //                     setIsLoading(false);
    //                 },
    //             }
    //         );
    //     },
    //     300);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        // Reorder the topics array
        const reorderedTopics = Array.from(topics);
        const [movedItem] = reorderedTopics.splice(result.source.index, 1);
        reorderedTopics.splice(result.destination.index, 0, movedItem);

        // Update state
        setTopics(reorderedTopics);

        // Update backend with the new order
        const updatedOrder = reorderedTopics.map((topic, index) => ({
            id: topic.id,
            order: index + 1,
        }));

        //set the loading state
        setIsLoading(true);

        router.post(
            `/topics/${topicMaster.id}/reorder`,
            {
                topics: updatedOrder,
            },
            {
                onSuccess: () => {
                    setIsLoading(false);
                },
                onError: (errors) => {
                    console.error(errors);
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <a>Class</a>
                    </li>
                    <li>
                        <a>Topic Manage</a>
                    </li>
                    <li>
                        <a href="/topicList">Topic List</a>
                    </li>
                    <li className="text-gray-500">Topic Details</li>
                </ul>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Master Topic Details</h1>
                <button
                    onClick={handleOpenModal}
                    className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]"
                >
                    + Add new Topic
                </button>
            </div>

            <div className="mb-6 flex space-x-4">
                <div className="flex-1">
                    <label className="block mb-2">Master Topic Name</label>
                    <input
                        type="text"
                        className="border rounded p-2 w-full bg-gray-200"
                        disabled
                        value={topicMaster.name}
                    />
                </div>

                <div className="flex-1">
                    <label className="block mb-2">Subject</label>
                    <input
                        type="text"
                        className="border rounded p-2 w-full bg-gray-200"
                        disabled
                        value={subject.name}
                    />
                </div>
            </div>

            <hr className="my-4 border-t-2 border-gray-400" />

            {/* Drag-and-Drop Table */}
            <DragDropContext onDragEnd={!isLoading ? onDragEnd : () => {}}>
                <Droppable droppableId="topics" isDropDisabled={isLoading}>
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-4"
                        >
                            {topics.length > 0 ? (
                                topics.map((topic, index) => (
                                    <Draggable
                                        key={topic.id.toString()}
                                        draggableId={topic.id.toString()}
                                        index={index}
                                        isDragDisabled={isLoading}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className={`p-4 rounded shadow ${
                                                    isLoading
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-lg font-bold">
                                                        {topic.name}
                                                    </h2>
                                                    <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C] mt-2">
                                                        <Link
                                                            href={`/topics/${topic.id}/${topicMaster.id}/edit`}
                                                            className="text-white"
                                                        >
                                                            Manage Subtopics
                                                        </Link>
                                                    </button>
                                                </div>
                                                <hr className="my-4 border-t-2 border-gray-400" />
                                                <div className="mt-2 pl-6 text-slate-800">
                                                    {topic.subtopics.length >
                                                    0 ? (
                                                        topic.subtopics.map(
                                                            (subtopic) => (
                                                                <div
                                                                    key={
                                                                        subtopic.id
                                                                    }
                                                                    className="flex items-center space-x-2"
                                                                >
                                                                    <GiNotebook
                                                                        className="text-xl"
                                                                        color="#42604C"
                                                                    />
                                                                    <p>
                                                                        {
                                                                            subtopic.name
                                                                        }
                                                                    </p>
                                                                </div>
                                                            )
                                                        )
                                                    ) : (
                                                        <div className="text-gray-500 italic">
                                                            No subtopics found.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            ) : (
                                <p>
                                    No topics available. Please add your topics.
                                </p>
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* AddTopicsModal */}
            <AddTopicsModal
                showModal={showModal}
                handleCancel={handleCloseModal}
                handleSave={handleSaveTopics}
            />
        </div>
    );
};

export default TableDetails;
