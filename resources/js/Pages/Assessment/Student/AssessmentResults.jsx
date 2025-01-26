import React from "react";
import { usePage } from "@inertiajs/react";

const AssessmentResults = () => {
    const { student, assessments } = usePage().props;

    return (
        <div className="p-6 bg-base-200 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">
                Assessment Results for {student.name}
            </h1>

            <div className="bg-base-100 rounded-lg shadow-md overflow-hidden">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Time Answered (minutes)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Score
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.map((assessment) => (
                            <tr key={assessment.id}>
                                <td className="px-6 py-4">
                                    {assessment.title}
                                </td>
                                <td className="px-6 py-4">
                                    {assessment.status}
                                </td>
                                <td className="px-6 py-4">
                                    {assessment.started_at &&
                                    assessment.ended_at
                                        ? Math.round(
                                              (new Date(assessment.ended_at) -
                                                  new Date(
                                                      assessment.started_at
                                                  )) /
                                                  60000
                                          )
                                        : "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {assessment.score !== null
                                        ? `${assessment.score}% (${assessment.correct_answers}/${assessment.total_questions})`
                                        : "N/A"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssessmentResults;
