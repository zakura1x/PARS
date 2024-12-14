import React, { useState } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import Header from "../../components/TopicManagement/Header";
import AddMasterTopicsModal from "../../components/TopicManagement/AddMasterTopicsModal";
import TopicTable from "../../components/TopicManagement/TopicTable";
import FlashMessage from "../../components/Notifications/FlashMessage";

const TopicManagement = () => {
    const [showMasterTopicModal, setShowMasterTopicModal] = useState(false);

    // Extract data passed from controller
    const { flash, topics, subjects } = usePage().props;

    // Form data state
    const { data, setData, post, reset, errors } = useForm({
        id: null,
        name: "",
        subject_id: "", // Change to match subject selection
        status: true,
    });

    // Filter only active subjects
    const activeSubjects = subjects.filter((subject) => subject.status === 1);

    // Handle save action
    const handleSaveMasterTopic = (e) => {
        e.preventDefault();
        const url = data.id
            ? `/topicmasters/edit/${data.id}`
            : `/addTopicmasters`;

        post(url, data, {
            onSuccess: () => {
                setShowMasterTopicModal(false);
                reset();
            },
        });
    };

    const handleCancelMasterTopic = () => {
        reset();
        setShowMasterTopicModal(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <FlashMessage message={flash.message} />
            <Header setShowModal={setShowMasterTopicModal} />

            <TopicTable
                topicmasters={topics}
                setShowModal={setShowMasterTopicModal}
            />

            {/* Pass activeSubjects to modal */}
            <AddMasterTopicsModal
                showModal={showMasterTopicModal}
                handleCancel={handleCancelMasterTopic}
                handleSaveChanges={handleSaveMasterTopic}
                data={data}
                setData={setData}
                errors={errors}
                subjects={activeSubjects}
            />
        </div>
    );
};

export default TopicManagement;
