import React from "react";
import { usePage } from "@inertiajs/react";

const StudentDashboard = () => {
    const {
        latestAssessments,
        latestPracticeAssessments,
        topicGradingCriteria,
    } = usePage().props;

    return (
        <div className="m-2 p-4 rounded-md bg-white ">
            <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                    Latest Assessments
                </h2>
                {latestAssessments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {latestAssessments.map((assessment) => (
                            <div
                                key={assessment.id}
                                className="card bg-base-100 shadow-xl rounded-lg p-4"
                            >
                                <h3 className="text-lg font-bold">
                                    {assessment.title}
                                </h3>
                                <p className="text-sm">
                                    Subject: {assessment.subject.name}
                                </p>
                                <p className="text-sm">
                                    Grade: {assessment.grade}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No assessments found.</p>
                )}
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                    Latest Practice Assessments
                </h2>
                {latestPracticeAssessments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {latestPracticeAssessments.map((practiceAssessment) => (
                            <div
                                key={practiceAssessment.id}
                                className="card bg-base-100 shadow-xl rounded-lg p-4"
                            >
                                {/* <h3 className="text-lg font-bold">
                                    {practiceAssessment.subject.name}
                                </h3> */}
                                <p className="text-sm">
                                    Grade:{" "}
                                    {practiceAssessment.results
                                        ? practiceAssessment.results.score
                                        : "No result yet"}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No practice assessments found.</p>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-2">
                    Topic Grading Criteria
                </h2>
                {topicGradingCriteria.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {topicGradingCriteria.map((criteria) => (
                            <li key={criteria.id}>
                                {criteria.topic.name} - {criteria.percentage}%
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No topic grading criteria found.</p>
                )}
            </section>
        </div>
    );
};

export default StudentDashboard;
