import React from 'react'
import StatsCards from "../../components/Dashboard/ProgramHead&DeanDashboard/StatsCards"
import ProficiencyOverviewChart from "../../components/Dashboard/ProgramHead&DeanDashboard/ProficiencyOverviewChart"
import StudentPerformanceTable from "../../components/Dashboard/ProgramHead&DeanDashboard/StudentPerformanceTable"
import ExamAssessmentTracker from "../../components/Dashboard/ProgramHead&DeanDashboard/ExamAssessmentTracker"
import StudentListTable from "../../components/Dashboard/ProgramHead&DeanDashboard/StudentListTable"
import AssessmentApprovalsTable from "../../components/Dashboard/ProgramHead&DeanDashboard/AssessmentApprovalsTable"

export default function ProgramHeadDashboard({ metrics, recentAssessments, studentPerformance, proficiencyDistribution, pendingAssessments }) {
  const stats = {
    pendingApprovals: metrics.assessmentsNeedingApproval,
    highProficientStudents: metrics.highProficiencyStudents,
    enrolledStudents: metrics.totalStudents,
    studentsNeedIntervention: metrics.studentsNeedingIntervention,
    activeProfessors: metrics.activeProfessors,
    programHeads: metrics.activeProgramHeads,
    deans: metrics.activeDeans,
  }

  const proficiencyData = []
  proficiencyDistribution.forEach(subject => {
    subject.topics.forEach(topic => {
      const dist = topic.proficiency_distribution
      proficiencyData.push({
        topic: topic.topic_name,
        beginner: dist.beginner,
        intermediate: dist.intermediate,
        advanced: dist.advanced
      })
    })
  })

  const students = studentPerformance.map(student => ({
    id: student.id,
    name: student.name,
    email: student.email, // Assuming email is used as unique identifier
    averageScore: student.average_score,
    status: student.average_score >= 85 ? 'good' : student.average_score < 75 ? 'intervene' : 'average'
  }))

  const assessments = recentAssessments.map(a => ({
    id: a.id,
    name: a.title,
    averageScore: null, // Assuming not available in this dataset
    submissions: null, // Assuming not available in this dataset
  }))

  return (
    <div className="container mx-auto p-4">
      <StatsCards stats={stats} />

      <ProficiencyOverviewChart data={proficiencyData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <StudentPerformanceTable students={students} />
        <ExamAssessmentTracker assessments={assessments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <StudentListTable students={students} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
        <AssessmentApprovalsTable pendingApprovals={pendingAssessments} />
      </div>
    </div>
  )
}
