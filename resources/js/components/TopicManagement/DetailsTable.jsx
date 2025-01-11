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
    const sortedParentTopics = Array.isArray(parentTopics)
        ? parentTopics.sort((a, b) => a.order - b.order)
        : Object.values(parentTopics).sort((a, b) => a.order - b.order);

    const subTopicsArray = Array.isArray(subTopics)
        ? subTopics
        : Object.values(subTopics);

    //console.log(parentTopics);
    // console.log("Rendering DetailsTable");
    //console.log("Parent Topics:", sortedParentTopics);
    // console.log("Sub Topics:", subTopicsArray);

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
                                    key={topic.id} // Use topic.id as a fallback if topic.order is null
                                    draggableId={topic.id.toString()} // Same here
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
                                                {subTopicsArray.length > 0 &&
                                                subTopicsArray.some((st) => {
                                                    // console.log(
                                                    //     `Checking subtopic ${st.id} with parent_id ${st.parent_id} against topic ${topic.id}`
                                                    // );
                                                    return (
                                                        st.parent_id ===
                                                        topic.id
                                                    );
                                                }) ? (
                                                    subTopicsArray
                                                        .filter((st) => {
                                                            const match =
                                                                st.parent_id ===
                                                                topic.id;
                                                            // console.log(
                                                            //     `Subtopic ${st.id} with parent_id ${st.parent_id} matches topic ${topic.id}: ${match}`
                                                            // );
                                                            return match;
                                                        })
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
