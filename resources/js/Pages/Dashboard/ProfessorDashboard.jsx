import React, { useState, useEffect } from "react";
import StatsCards from "../../components/Dashboard/ProfessorDashboard/StatsCards";
import ProficiencyOverviewChart from "../../components/Dashboard/ProgramHead&DeanDashboard/ProficiencyOverviewChart";
import StudentPerformanceTable from "../../components/Dashboard/ProgramHead&DeanDashboard/StudentPerformanceTable";
import ExamAssessmentTracker from "../../components/Dashboard/ProgramHead&DeanDashboard/ExamAssessmentTracker";
import StudentListTable from "../../components/Dashboard/ProgramHead&DeanDashboard/StudentListTable";
import AssessmentApprovalsTable from "../../components/Dashboard/ProgramHead&DeanDashboard/AssessmentApprovalsTable";
import StudentDashboard from "../Dashboard/StudentDashboard";

export default function ProfessorDashboard({
    metrics,
    recentAssessments,
    studentPerformance,
    proficiencyDistribution,
    pendingAssessments,
    allSubjects,
}) {
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [subjectProficiency, setSubjectProficiency] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewingStudentId, setViewingStudentId] = useState(null);
    const [studentDashboardData, setStudentDashboardData] = useState(null);

    // Modified stats object - removed faculty-related metrics
    const stats = {
        pendingApprovals: metrics.assessmentsNeedingApproval,
        highProficientStudents: metrics.highProficiencyStudents,
        enrolledStudents: metrics.totalStudents,
        studentsNeedIntervention: metrics.studentsNeedingIntervention,
        completedAssessments: metrics.completedAssessments,
        totalTopics: metrics.totalTopics,
        pendingAssessments: metrics.pendingAssessments,
    };

    const handleViewStudent = async (studentId) => {
        try {
            setLoading(true);
            const response = await fetch(`/dashboard/student/${studentId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch student dashboard data");
            }
            const data = await response.json();
            setStudentDashboardData(data);
            setViewingStudentId(studentId);
        } catch (error) {
            console.error("Error fetching student dashboard:", error);
            // Handle error (show toast, etc.)
        } finally {
            setLoading(false);
        }
    };

    const handleBackToDashboard = () => {
        setViewingStudentId(null);
        setStudentDashboardData(null);
    };

    // Fetch proficiency data when subject changes
    useEffect(() => {
        if (selectedSubject) {
            const fetchSubjectProficiency = async () => {
                setLoading(true);
                try {
                    const response = await fetch(
                        `/dashboard/proficiency/student/${selectedSubject}`
                    );
                    if (!response.ok) {
                        throw new Error("Failed to fetch proficiency data");
                    }
                    const data = await response.json();
                    setSubjectProficiency(data);
                } catch (error) {
                    console.error("Error fetching subject proficiency:", error);
                    setSubjectProficiency([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchSubjectProficiency();
        } else {
            // Use the initial proficiency distribution if no subject is selected
            const initialProficiencyData = [];
            proficiencyDistribution.forEach((subject) => {
                subject.topics.forEach((topic) => {
                    const dist = topic.proficiency_distribution;
                    initialProficiencyData.push({
                        topic: topic.topic_name,
                        beginner: dist.beginner,
                        intermediate: dist.intermediate,
                        advanced: dist.advanced,
                    });
                });
            });
            setSubjectProficiency(initialProficiencyData);
        }
    }, [selectedSubject, proficiencyDistribution]);

    const students = studentPerformance.map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        averageScore: student.average_score,
        status:
            student.average_score >= 85
                ? "good"
                : student.average_score < 75
                ? "intervene"
                : "average",
    }));

    const assessments = recentAssessments.map((a) => ({
        id: a.id,
        name: a.title,
        averageScore: null,
        submissions: null,
    }));

    if (viewingStudentId && studentDashboardData) {
        return (
            <div className="container mx-auto p-4">
                <button
                    onClick={handleBackToDashboard}
                    className="btn btn-primary mb-4"
                >
                    ← Back to Professor Dashboard
                </button>
                <StudentDashboard
                    student={studentDashboardData.student}
                    recentAssessments={studentDashboardData.recentAssessments}
                    proficiencyData={studentDashboardData.proficiencyData}
                    performanceMetrics={studentDashboardData.performanceMetrics}
                    subjects={studentDashboardData.subjects}
                    selectedSubject={studentDashboardData.selectedSubject}
                    isViewingAsAdmin={true}
                />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <StatsCards stats={stats} />

            <div className="card bg-base-200 shadow-xl mb-6">
                <div className="card-body">
                    <div className="flex justify-between items-center">
                        <h2 className="card-title">
                            STUDENT'S PROFICIENCY OVERVIEW
                        </h2>
                        {allSubjects && allSubjects.length > 0 && (
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={selectedSubject || ""}
                                onChange={(e) =>
                                    setSelectedSubject(e.target.value)
                                }
                            >
                                <option value="">All Subjects</option>
                                {allSubjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <ProficiencyOverviewChart data={subjectProficiency} />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <StudentPerformanceTable
                    students={students}
                    onViewStudent={handleViewStudent}
                />
                <ExamAssessmentTracker assessments={assessments} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <StudentListTable
                    students={students}
                    onViewStudent={handleViewStudent}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <AssessmentApprovalsTable
                    pendingApprovals={pendingAssessments}
                />
            </div>
        </div>
    );
}

// Modified StatsCards component for Professor
