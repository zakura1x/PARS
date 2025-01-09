import React, { useState } from "react";
import { GiNotebook } from "react-icons/gi";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Link, usePage, useForm, router } from "@inertiajs/react";
import DetailsHeader from "../../components/TopicManagement/DetailsHeader";
import DetailsTable from "../../components/TopicManagement/DetailsTable";
import AddTopicsModal from "../../components/TopicManagement/AddTopicsModal";
import FlashMessage from "../../components/Notifications/FlashMessage";

const TopicDetails = () => {
    const {
        subject,
        topics = [],
        parentTopics = [],
        subTopics = [],
        flash,
    } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const handleModal = () => setShowModal(!showModal);

    const onDragEnd = (result) => {
        if (!result.destination) return; // Exit if there's no destination

        // Reorder parentTopics array in local state
        const reorderedTopics = Array.from(parentTopics);
        const [movedTopic] = reorderedTopics.splice(result.source.index, 1);
        reorderedTopics.splice(result.destination.index, 0, movedTopic);

        // Update the order field in the reordered array
        const updatedTopics = reorderedTopics.map((topic, index) => ({
            id: topic.id,
            order: index + 1, // Ensure sequential ordering (1-based index)
        }));

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

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
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
                        <a className="text-gray-500">Topic Details</a>
                    </li>
                </ul>
            </div>
            <FlashMessage message={flash.message} />
            <DetailsHeader
                subject={subject}
                handleModal={handleModal} // Pass the handleModal function
            ></DetailsHeader>
            <DetailsTable
                parentTopics={parentTopics}
                subTopics={subTopics}
                subject={subject}
                isLoading={isLoading}
                onDragEnd={onDragEnd}
            />
            {/* AddTopicsModal */}
            <AddTopicsModal
                showModal={showModal}
                handleCancel={handleModal}
                subjectId={subject.id}
            />
        </div>
    );
};

export default TopicDetails;
