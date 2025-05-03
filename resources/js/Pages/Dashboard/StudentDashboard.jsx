import React from "react";
import { usePage } from "@inertiajs/react";

const StudentDashboard = (
    student,
    recentAssessments,
    proficiencyData,
    performanceMetrics,
    subjects,
    selectedSubject
) => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold">
                        PARS – Student’s Learning Space
                    </h1>
                    <p className="text-gray-600">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div>
                    <span className="font-medium">
                        ID: {student.student_id}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-gray-500">Average Score</p>
                    <p className="text-2xl font-bold">
                        {performanceMetrics.average_score}%
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-gray-500">Total Assessments Taken</p>
                    <p className="text-2xl font-bold">
                        {performanceMetrics.total_assessments_taken}
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow p-4 text-center">
                    <p className="text-gray-500">Hours Logged In</p>
                    <p className="text-2xl font-bold">56hrs</p>{" "}
                    {/* Make this dynamic later */}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Exam Assessments */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="font-semibold mb-2">
                        Exam Assessment Tracker
                    </h2>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Score</th>
                                <th>Subject</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAssessments.examinations.map(
                                (exam, index) => (
                                    <tr key={index}>
                                        <td>{exam.assessment?.title}</td>
                                        <td>{exam.result?.score}</td>
                                        <td>
                                            {exam.assessment?.subject?.name}
                                        </td>
                                        <td>{exam.completed_at}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Practice Assessments */}
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="font-semibold mb-2">
                        Practice Assessment Tracker
                    </h2>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Score</th>
                                <th>Subject</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAssessments.practices.map(
                                (practice, index) => (
                                    <tr key={index}>
                                        <td>{practice.name}</td>
                                        <td>{practice.results?.score}</td>
                                        <td>{practice.subject?.name}</td>
                                        <td>{practice.submitted_at}</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
                <h2 className="font-semibold mb-2">Proficiency Levels</h2>
                <div className="mb-4">
                    <label>Select Subject:</label>
                    <select className="ml-2 border p-1 rounded">
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>
                {proficiencyData.map((topic, index) => (
                    <div key={index} className="mb-2">
                        <p className="text-sm font-medium">
                            {topic.topic?.name}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-green-500 h-3 rounded-full"
                                style={{ width: `${topic.proficiency_level}%` }}
                            />
                        </div>
                        <p className="text-xs text-gray-500">
                            Level: Intermediate
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;
