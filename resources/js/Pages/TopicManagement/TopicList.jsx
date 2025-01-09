import React, { useState } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
import Header from "../../components/TopicManagement/Header";
import TopicTable from "../../components/TopicManagement/TopicTable";
import FlashMessage from "../../components/Notifications/FlashMessage";

const TopicManagement = () => {
    const [showMasterTopicModal, setShowMasterTopicModal] = useState(false);

    // Extract data passed from controller
    const { flash, subjects } = usePage().props;
    //console.log(subjects);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <FlashMessage message={flash.message} />
            <Header setShowModal={setShowMasterTopicModal} />

            <TopicTable subjects={subjects} />
        </div>
    );
};

export default TopicManagement;
