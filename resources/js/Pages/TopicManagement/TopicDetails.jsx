import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import AddTopicsModal from "../../components/TopicManagement/AddTopicsModal";
import AddSubtopicsModal from "../../components/TopicManagement/AddSubtopicsModal";

const TableDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const [showSubtopicModal, setShowSubtopicModal] = useState(false);
    const [currentSubtopics, setCurrentSubtopics] = useState([]);
    const [selectedTopicIndex, setSelectedTopicIndex] = useState(null);

    const [tableData, setTableData] = useState([
        {
            id: "1",
            topic: "Topic 1",
            subtopics: ["Subtopic 1.1", "Subtopic 1.2"],
        },
        { id: "2", topic: "Topic 2", subtopics: ["Subtopic 2.1"] },
    ]);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleSaveTopics = (topics) => {
        setTableData(topics);
        setShowModal(false);
    };

    // Open Subtopics Modal
    const handleOpenSubtopicModal = (index) => {
        setSelectedTopicIndex(index);
        setCurrentSubtopics([...tableData[index].subtopics]);
        setShowSubtopicModal(true);
    };

    const handleCloseSubtopicModal = () => {
        setShowSubtopicModal(false);
        setSelectedTopicIndex(null);
    };

    const handleSaveSubtopics = (updatedSubtopics) => {
        const updatedData = [...tableData];
        updatedData[selectedTopicIndex].subtopics = updatedSubtopics;
        setTableData(updatedData);
        handleCloseSubtopicModal();
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(tableData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setTableData(items);
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
                {/* Page Header */}
                <h1 className="text-2xl font-bold">Master Topic Details</h1>

                {/* Add Button */}
                <button
                    onClick={handleOpenModal}
                    className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                >
                    + Add
                </button>
            </div>

            <div className="mb-6 flex space-x-4">
                <div className="flex-1">
                    <label className="block mb-2">Master Topic Name</label>
                    <input
                        type="text"
                        value={masterTopicName}
                        className="border rounded p-2 w-full bg-gray-200"
                        disabled
                    />
                </div>

                <div className="flex-1">
                    <label className="block mb-2">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        className="border rounded p-2 w-full bg-gray-200"
                        disabled
                    />
                </div>
            </div>

            {/* Horizontal Line */}
            <hr className="my-4 border-t-2 border-gray-400" />

            {/* Drag-and-Drop Context */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="topics">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="space-y-4"
                        >
                            {tableData.map((row, index) => (
                                <Draggable
                                    key={row.id}
                                    draggableId={row.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                                        >
                                            <div>
                                                <h2 className="text-lg font-bold">
                                                    {row.topic}
                                                </h2>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    {row.subtopics.length ? (
                                                        row.subtopics.map(
                                                            (subtopic, idx) => (
                                                                <p key={idx}>
                                                                    {subtopic}
                                                                </p>
                                                            )
                                                        )
                                                    ) : (
                                                        <p>No subtopics yet</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleOpenSubtopicModal(
                                                        index
                                                    )
                                                }
                                                className="text-blue-500 hover:underline"
                                            >
                                                + Add Subtopic
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

            {/* AddTopicsModal */}
            <AddTopicsModal
                showModal={showModal}
                handleCancel={handleCloseModal}
                handleSave={handleSaveTopics}
                data={tableData}
            />

            {/* AddSubtopicsModal */}
            <AddSubtopicsModal
                showModal={showSubtopicModal}
                handleCancel={handleCloseSubtopicModal}
                handleSave={handleSaveSubtopics}
                initialSubtopics={currentSubtopics}
            />
        </div>
    );
};

export default TableDetails;
