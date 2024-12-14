import React, { useState } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import Header from "../../../components/TopicManagement/Header";
import AddMasterTopicsModal from "../../../components/TopicManagement/AddMasterTopicsModal";
import TopicTable from "../../../components/TopicManagement/TopicTable";
import FlashMessage from "../../../components/Notifications/FlashMessage";

const TopicManagement = ({ userId }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showMasterTopicModal, setShowMasterTopicModal] = useState(false);

    const { flash, topicmasters, subjects } = usePage().props;

    const { data, setData, post, reset, errors } = useForm({
        id: 1,
        name: "sample",
        subject: "",
        topics: "",
        subtopics: "",
        created_by: userId,
        status: true,
    });

    const handleSaveMasterTopic = () => {
        // Simulate save operation for master topic
        console.log("Master Topic Saved:", data);

        setShowMasterTopicModal(false);

        router.visit(`/topicDetails`);
    };

    const handleCancelMasterTopic = () => {
        reset();
        setShowMasterTopicModal(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <FlashMessage message={flash.message}/>
            <Header
                setShowModal={setShowMasterTopicModal}
            />
            <TopicTable
                topicmasters={topicmasters}
                setShowModal={setShowMasterTopicModal}
            />
            <AddMasterTopicsModal
                showModal={showMasterTopicModal}
                handleCancel={handleCancelMasterTopic}
                handleSaveChanges={handleSaveMasterTopic}
                data={data}
                setData={setData}
                errors={errors}
                subjects={subjects}
            />
        </div>
    );
};

export default TopicManagement;
