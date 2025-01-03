import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, usePage, Link } from "@inertiajs/react";
import AddSubtopicsModal from "../../components/TopicManagement/AddSubtopicsModal";

const TopicEdit = ({ onSave, onCancel }) => {
    const { topic, subject, topicMaster } = usePage().props; // Extract `topic` and `subject` from the page props

    // States for modal visibility
    const [showSubtopicModal, setShowSubtopicModal] = useState(false);
    const toggleSubtopicModal = () => setShowSubtopicModal(!showSubtopicModal);
    const [isLoading, setIsLoading] = useState(false);

    const { data, setData, post, errors } = useForm({
        name: topic.name,
        subtopics: topic.sub_topics || [], // Set subtopics for editing
        subject_id: subject.id,
    });

    // Handle the removal of subtopics
    const handleRemoveSubtopic = (index) => {
        const updatedSubtopics = data.subtopics.filter((_, i) => i !== index);
        setData("subtopics", updatedSubtopics);
    };

    // Handle the drag-and-drop functionality
    const onDragEnd = (result) => {
        if (!result.destination) return;

        // Reorder subtopics
        const reorderedSubtopics = Array.from(topic.sub_topics);
        const [movedSubtopic] = reorderedSubtopics.splice(
            result.source.index,
            1
        );
        reorderedSubtopics.splice(result.destination.index, 0, movedSubtopic);

        // Update subtopics order in the state
        const updatedSubtopics = reorderedSubtopics.map((subtopic, index) => ({
            ...subtopic,
            order: index + 1,
        }));

        // Sync with backend
        setIsLoading(true);
        router.post(
            `/topics/${topic.id}/update-subtopics-order`,
            { subtopics: updatedSubtopics },
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

    // Handle subtopic name changes
    const handleSubtopicChange = (index, newName) => {
        const updatedSubtopics = [...data.subtopics];
        updatedSubtopics[index].name = newName;
        setData("subtopics", updatedSubtopics);
    };

    // Save subtopics to the backend
    const saveSubtopics = () => {
        post(
            `/topics/${topic.id}/update-subtopics`,
            { subtopics: data.subtopics },
            {
                onSuccess: () => {
                    setShowSubtopicModal(false);
                },
                onError: (errors) => {
                    console.error(errors);
                },
            }
        );
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
                        <Link href="/topicList">Topic Master</Link>
                    </li>
                    <li>
                        <Link href={`/topic-masters/${topicMaster.id}/edit`}>
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
                    <h2 className="text-md font-medium">{topic.name}</h2>
                </div>
                <div className="flex flex-col items-center space-y-2 lg:flex-row lg:space-x-2 lg:space-y-0">
                    <button
                        className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]"
                        onClick={toggleSubtopicModal}
                    >
                        + Add Subtopic
                    </button>
                    <button
                        className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]"
                        onClick={toggleSubtopicModal}
                    >
                        - Edit Topic title
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
                                    {topic.sub_topics.map((subtopic, index) => (
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
                topicMaster={topicMaster}
            />
        </div>
    );
};

export default TopicEdit;
