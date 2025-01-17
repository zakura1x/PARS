import React, { useState, useEffect } from "react";
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
        topics,
        parentTopics = [],
        subTopics = [],
        flash,
    } = usePage().props;

    const { data, setData, post, errors } = useForm({
        name: topics?.name || "",
        parentTopics: Array.isArray(parentTopics)
            ? parentTopics
            : Object.values(parentTopics),
        subject_id: subject.id,
    });

    // Sort topics based on the `order` field
    const sortedTopics = Array.isArray(data.parentTopics)
        ? data.parentTopics.sort((a, b) => a.order - b.order)
        : [];

    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Add loading state
    const handleModal = () => setShowModal(!showModal);

    const onDragEnd = (result) => {
        if (!result.destination) return;

        // Reorder the parent topics
        const reorderedTopics = Array.from(sortedTopics);
        const [movedTopic] = reorderedTopics.splice(result.source.index, 1);
        reorderedTopics.splice(result.destination.index, 0, movedTopic);

        // Update the order in the local state (which will trigger a re-render)
        const updatedTopics = reorderedTopics.map((topic, index) => ({
            ...topic,
            order: index + 1,
        }));

        // Update the local state with the new order
        setData("parentTopics", updatedTopics);

        // Optionally, send the updated order to the backend
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

    // const handleParentTopicAdded = (newParentTopic) => {
    //     const updatedParentTopics = [...data.parentTopics, newParentTopic];
    //     setData("parentTopics", updatedParentTopics);
    //     console.log("New Parent Topic Added:", newParentTopic);
    //     console.log("Updated Parent Topics:", updatedParentTopics);
    // };

    // Keep `data.parentTopics` in sync with `parentTopics` from props
    useEffect(() => {
        //if (Array.isArray(parentTopics) && parentTopics.length > 0) {
        setData("parentTopics", parentTopics);
        console.log("set", parentTopics);
        //}
    }, [parentTopics]);

    useEffect(() => {
        //console.log("Updated Parent Topics:", data.parentTopics);
    }, [data.parentTopics]);

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
                parentTopics={data.parentTopics} // Pass the updated parentTopics
                subTopics={subTopics}
                isLoading={isLoading}
                onDragEnd={onDragEnd}
            />

            {/* AddTopicsModal */}
            <AddTopicsModal
                showModal={showModal}
                handleCancel={handleModal}
                subjectId={subject.id}
                // onParentTopicAdded={handleParentTopicAdded}
            />
        </div>
    );
};

export default TopicDetails;
