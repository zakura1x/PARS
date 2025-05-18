import React, { useState, useEffect } from "react";
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

    // Keep `data.subtopics` in sync with `subTopics` from props
    useEffect(() => {
        setData("subtopics", Array.isArray(subTopics) ? subTopics : []);
    }, [subTopics]);

    console.log(subTopics);

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

    // Handle addition of a new subtopic
    // const handleSubtopicAdded = (newSubtopic) => {
    //     const updatedSubtopics = [...data.subtopics, newSubtopic];
    //     setData("subTopics", updatedSubtopics);

    //     // Reload to fetch updated subtopics from the server (if necessary)
    //     router.reload({ only: ["subTopics"] });
    // };

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

            <div className="flex flex-row items-center space-x-4 lg:justify-between">
                <div className="flex flex-col space-y-2">
                    <h2 className="text-2xl font-bold">
                        Edit Topic Information
                    </h2>
                    <h2 className="text-md font-medium">
                        Topic Name: {topic.name}
                    </h2>
                </div>
                <div className="flex flex-col items-center space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0 lg:just">
                    <button
                        className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]"
                        onClick={toggleSubtopicModal}
                    >
                        + Add Subtopic
                    </button>
                    <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]">
                        <Link href={`/study-materials/index/${topic.id}`}>
                            Study Materials
                        </Link>
                    </button>
                </div>
            </div>
            <hr className="my-4 border-t-2 border-gray-400" />

            {/* Subtopics (Draggable) */}
            <div className="mb-4">
                {data.subtopics.length > 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="subtopics">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-4"
                                >
                                    {sortedSubtopics.map((subtopic, index) => (
                                        // Inside your TopicEdit component, modify the Draggable section:
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
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => {
                                                                    if (
                                                                        confirm(
                                                                            "Are you sure you want to delete this subtopic?"
                                                                        )
                                                                    ) {
                                                                        router.delete(
                                                                            `/topics/delete/${subtopic.id}`
                                                                        );
                                                                    }
                                                                }}
                                                                className="text-red-500 hover:text-red-700"
                                                                disabled={
                                                                    isLoading
                                                                }
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                            <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]">
                                                                <Link
                                                                    href={`/study-materials/index/${subtopic.id}`}
                                                                >
                                                                    Study
                                                                    Materials
                                                                </Link>
                                                            </button>
                                                        </div>
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
                    <div>No subtopics available</div>
                )}
            </div>

            {/* AddSubtopicsModal */}
            <AddSubtopicsModal
                showModal={showSubtopicModal}
                toggleModal={toggleSubtopicModal}
                topic={topic}
                subject={subject}
                // onSubtopicAdded={handleSubtopicAdded}
            />
        </div>
    );
};

export default TopicEdit;
