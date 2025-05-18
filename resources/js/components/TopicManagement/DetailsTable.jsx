import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GiNotebook } from "react-icons/gi";
import { Link, router } from "@inertiajs/react";
import { FaTrash } from "react-icons/fa";

const DetailsTable = ({
    parentTopics = [],
    onDragEnd,
    isLoading,
    subTopics = [],
}) => {
    const sortedParentTopics = Array.isArray(parentTopics)
        ? parentTopics.sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
        : Object.values(parentTopics).sort(
              (a, b) => (a.order ?? a.id) - (b.order ?? b.id)
          );

    const subTopicsArray = Array.isArray(subTopics)
        ? subTopics
        : Object.values(subTopics);

    const handleDelete = (topicId) => {
        if (
            confirm(
                "Are you sure you want to delete this topic and all its subtopics?"
            )
        ) {
            router.delete(`/topics/delete/${topicId}`);
        }
    };

    if (sortedParentTopics.length === 0) {
        return <p className="text-gray-500 italic">Loading topics...</p>;
    }

    return (
        <DragDropContext onDragEnd={!isLoading ? onDragEnd : () => {}}>
            <Droppable droppableId="parentTopics" isDropDisabled={isLoading}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                    >
                        {sortedParentTopics.length > 0 ? (
                            sortedParentTopics.map((topic, index) => (
                                <Draggable
                                    key={topic.id}
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
                                                    {topic.name ||
                                                        "Untitled Topic"}
                                                </h2>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                topic.id
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 p-2"
                                                        disabled={isLoading}
                                                        title="Delete topic"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                    <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]">
                                                        <Link
                                                            href={`/topics/edit/${topic.id}`}
                                                            className="text-white"
                                                        >
                                                            Manage Subtopics
                                                        </Link>
                                                    </button>
                                                </div>
                                            </div>
                                            <hr className="my-4 border-t-2 border-gray-400" />
                                            <div className="mt-2 pl-6 text-slate-800">
                                                {subTopicsArray.length > 0 &&
                                                subTopicsArray.some((st) => {
                                                    return (
                                                        st.parent_id ===
                                                        topic.id
                                                    );
                                                }) ? (
                                                    subTopicsArray
                                                        .filter((st) => {
                                                            return (
                                                                st.parent_id ===
                                                                topic.id
                                                            );
                                                        })
                                                        .map((subtopic) => (
                                                            <div
                                                                key={
                                                                    subtopic.id
                                                                }
                                                                className="flex items-center space-x-2 mb-2 group"
                                                            >
                                                                <GiNotebook
                                                                    className="text-xl"
                                                                    color="#42604C"
                                                                />
                                                                <p>
                                                                    {subtopic.name ||
                                                                        "Untitled Subtopic"}
                                                                </p>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            subtopic.id
                                                                        )
                                                                    }
                                                                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    disabled={
                                                                        isLoading
                                                                    }
                                                                    title="Delete subtopic"
                                                                >
                                                                    <FaTrash
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>
                                                        ))
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
                            <p className="text-gray-500 italic">
                                No topics available. Please add your topics.
                            </p>
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DetailsTable;
