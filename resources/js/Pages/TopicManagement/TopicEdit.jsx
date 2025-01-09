import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import AddSubtopicsModal from "../../components/TopicManagement/AddSubtopicsModal";

const TopicEdit = () => {
    const { topic, subject, subTopics } = usePage().props; // Extract `topic` and `subject` from the page props

    // States for modal visibility
    const [showSubtopicModal, setShowSubtopicModal] = useState(false);
    const toggleSubtopicModal = () => setShowSubtopicModal(!showSubtopicModal);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors } = useForm({
        name: topic.name,
        subtopics: subTopics || [], // Set subtopics for editing
        subject_id: subject.id,
    });

    // Sort subtopics based on the `order` field
    const sortedSubtopics = data.subtopics.sort((a, b) => a.order - b.order);

    // Handle the drag-and-drop functionality
    const onDragEnd = (result) => {
        if (!result.destination) return; // Exit if there's no destination

        // Reorder subtopics array in local state
        const reorderedTopics = Array.from(sortedSubtopics);
        const [movedTopic] = reorderedTopics.splice(result.source.index, 1);
        reorderedTopics.splice(result.destination.index, 0, movedTopic);

        // Update the `order` fields
        const updatedTopics = reorderedTopics.map((topic, index) => ({
            ...topic,
            order: index + 1, // Update order
        }));

        // Update the local state with the new order
        setData("subtopics", updatedTopics);

        // Send reordered data to the backend
        setIsLoading(true);
        router.post(
            `/topics/reorder/${subject.id}`, // Backend route for reordering
            { topics: updatedTopics }, // Payload
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

    const handleSubtopicAdded = (newSubtopic) => {
        setData("subtopics", [...data.subtopics, newSubtopic]);
    };

    return (
        <div className="p-4 bg-white rounded shadow">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <a>Class</a>
                    </li>
                    <li>
                        <Link href="/topic/lists">Topic List</Link>
                    </li>
                    <li>
                        <Link href={`/topics/view/details/${subject.id}`}>
                            Topic Details
                        </Link>
                    </li>
                    <li>
                        <a className="text-gray-500">
                            Subtopics ({topic.name})
                        </a>
                    </li>
                </ul>
            </div>

            <div className="flex flex-row items-center space-x-4">
                <div className="flex flex-col space-y-2">
                    <h2 className="text-lg font-bold">
                        Edit Topic Information
                    </h2>
                    <h2 className="text-md font-medium">
                        Topic Name: {topic.name}
                    </h2>
                </div>
                <div className="flex flex-col items-center space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
                    <button
                        className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]"
                        onClick={toggleSubtopicModal}
                    >
                        + Add Subtopic
                    </button>
                </div>
            </div>
            <hr className="my-4 border-t-2 border-gray-400" />

            {/* Subtopics (Draggable) */}
            <div className="mb-4">
                {subTopics.length > 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="subtopics">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-4"
                                >
                                    {data.subtopics.map((subtopic, index) => (
                                        <Draggable
                                            key={subtopic.id}
                                            draggableId={subtopic.id.toString()}
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
                                                    } bg-white`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <h2 className="text-lg font-semibold">
                                                            {subtopic.name}
                                                        </h2>
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                ) : (
                    <div>No subtopics available</div> // Optional message when no subtopics are found
                )}
            </div>

            {/* AddSubtopicsModal */}
            <AddSubtopicsModal
                showModal={showSubtopicModal}
                toggleModal={toggleSubtopicModal}
                topic={topic}
                subject={subject}
                onSubtopicAdded={handleSubtopicAdded} // Pass the handler as a prop
            />
        </div>
    );
};

export default TopicEdit;
