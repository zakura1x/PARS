import React from "react";
import { usePage } from "@inertiajs/react";
import CriteriaSearchTopics from "../../components/TopicGradingCriteria/CriteriaSearchTopics";
import CriteriaTopicsTable from "../../components/TopicGradingCriteria/CriteriaTopicsTable";
import FlashMessage from "../../components/Notifications/FlashMessage";

const CriteriaIndex = () => {
    const { subjects, topics, search, subjectId, flash } = usePage().props;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <FlashMessage message={flash.message} />
            <h1>Topics</h1>
            <CriteriaSearchTopics
                subjects={subjects}
                search={search}
                subjectId={subjectId}
            />
            <CriteriaTopicsTable topics={topics} />
        </div>
    );
};

export default CriteriaIndex;
