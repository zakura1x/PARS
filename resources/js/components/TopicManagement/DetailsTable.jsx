import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GiNotebook } from "react-icons/gi";
import { Link } from "@inertiajs/react";

const DetailsTable = ({
    parentTopics = [],
    onDragEnd,
    isLoading,
    subTopics = [],
}) => {
    // Safely sort parent topics and subtopics (if not empty)
    const sortedParentTopics = Array.isArray(parentTopics)
        ? [...parentTopics].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];
    const sortedSubTopics = Array.isArray(subTopics)
        ? [...subTopics].sort((a, b) => (a.order || 0) - (b.order || 0))
        : [];

    return (
        <DragDropContext onDragEnd={!isLoading ? onDragEnd : () => {}}>
            <Droppable droppableId="parentTopics" isDropDisabled={isLoading}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-4"
                    >
                        {/* Check if there are parent topics */}
                        {sortedParentTopics.length > 0 ? (
                            sortedParentTopics.map((topic, index) => (
                                <Draggable
                                    key={(topic.order ?? topic.id).toString()} // Use topic.id as a fallback if topic.order is null
                                    draggableId={(
                                        topic.order ?? topic.id
                                    ).toString()} // Same here
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
                                                <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C] mt-2">
                                                    <Link
                                                        href={`/topics/edit/${topic.id}`}
                                                        className="text-white"
                                                    >
                                                        Manage Subtopics
                                                    </Link>
                                                </button>
                                            </div>
                                            <hr className="my-4 border-t-2 border-gray-400" />
                                            <div className="mt-2 pl-6 text-slate-800">
                                                {/* Check if subtopics exist for the current parent topic */}
                                                {sortedSubTopics.length > 0 &&
                                                sortedSubTopics.some(
                                                    (st) =>
                                                        st.parent_id ===
                                                        topic.id
                                                ) ? (
                                                    sortedSubTopics
                                                        .filter(
                                                            (st) =>
                                                                st.parent_id ===
                                                                topic.id
                                                        )
                                                        .map((subtopic) => (
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
                                                                    {subtopic.name ||
                                                                        "Untitled Subtopic"}
                                                                </p>
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
