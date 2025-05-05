import React from "react";

const ProgramHeadDashboard = ({
    metrics,
    recentAssessments,
    studentPerformance,
    proficiencyDistribution,
}) => {
    console.log("Metrics:", metrics);
    console.log("Recent Assessments:", recentAssessments);
    console.log("Student Performance:", studentPerformance);
    console.log("Proficiency Distribution:", proficiencyDistribution);

    return <div>ProgramHeadDashboard</div>;
};

export default ProgramHeadDashboard;
