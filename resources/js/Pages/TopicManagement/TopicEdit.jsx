import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useForm, usePage, Link } from "@inertiajs/react";

const TopicEdit = ({ onSave, onCancel }) => {
    const { topic, subject } = usePage().props; // Extract `topic` and `subject` from the page props

    const { data, setData, put, errors } = useForm({
        name: topic.name,
        subtopics: topic.subTopics || [], // Set subtopics for editing
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleSubtopicChange = (index, newName) => {
        const updatedSubtopics = [...data.subtopics];
        updatedSubtopics[index].name = newName;
        setData("subtopics", updatedSubtopics);
    };

    const handleAddSubtopic = () => {
        setData("subtopics", [
            ...data.subtopics,
            { id: null, name: "" }, // Add a blank subtopic for editing
        ]);
    };

    const handleRemoveSubtopic = (index) => {
        const updatedSubtopics = data.subtopics.filter((_, i) => i !== index);
        setData("subtopics", updatedSubtopics);
    };

    // Handle the drag-and-drop functionality
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedSubtopics = Array.from(data.subtopics);
        const [movedSubtopic] = reorderedSubtopics.splice(
            result.source.index,
            1
        );
        reorderedSubtopics.splice(result.destination.index, 0, movedSubtopic);

        setData("subtopics", reorderedSubtopics);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSaving(true);

        put(`/topics/${topic.id}/update`, data, {
            onSuccess: () => {
                setIsSaving(false);
                if (onSave) onSave(); // Notify parent component of successful save
            },
            onError: (err) => {
                console.error(err);
                setIsSaving(false);
            },
        });
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
                        <Link href={`/topic-masters/${topic.id}/edit`}>
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
                <h2 className="text-lg font-bold">Edit Topics</h2>

                <button className="btn">+ Add new subtopic</button>
            </div>

            {/* Topic Name
            <div className="mb-4">
                <label className="block font-medium mb-2">Topic Name</label>
                <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                <h2>{topic.name}</h2>
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}
            </div> */}

            {/* Subtopics (Draggable) */}
            <div className="mb-4">
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="subtopics">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="space-y-2"
                            >
                                {data.subtopics.map((subtopic, index) => (
                                    <Draggable
                                        key={subtopic.id || index}
                                        draggableId={subtopic.id || index}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="flex items-center p-2 bg-gray-100 rounded shadow"
                                            >
                                                {/* <input
                                                        type="text"
                                                        className="border rounded p-2 flex-1"
                                                        value={subtopic.name}
                                                        onChange={(e) =>
                                                            handleSubtopicChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                    /> */}
                                                <h2>{subtopic.name}</h2>
                                                <button
                                                    type="button"
                                                    className="ml-2 text-red-500"
                                                    onClick={() =>
                                                        handleRemoveSubtopic(
                                                            index
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    );
};

export default TopicEdit;
