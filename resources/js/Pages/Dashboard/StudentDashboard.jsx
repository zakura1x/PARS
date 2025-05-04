import { useState } from "react"
import { usePage, router } from "@inertiajs/react"
import { PerformanceMetrics } from "../../components/Dashboard/StudentDashboard/PerformanceMetrics"
import { RecentAssessments } from "../../components/Dashboard/StudentDashboard/RecentAssessment"
import { ProficiencyChart } from "../../components/Dashboard/StudentDashboard/ProficiencyChart"
import { SubjectSelector } from "../../components/Dashboard/StudentDashboard/SubjectSelector"
import { BookOpen, GraduationCap, BarChart, Clock } from "lucide-react"

export default function StudentDashboard() {
  const { student, recentAssessments, proficiencyData, performanceMetrics, subjects, selectedSubject } = usePage().props

  const [activeTab, setActiveTab] = useState("overview")

  // Handle subject selection through Inertia
  const handleSubjectChange = (subject) => {
    // Use the current URL and just update the query parameter
    router.get(window.location.pathname, { subject: subject === null ? "" : subject }, { preserveState: true })
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-4 md:p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <SubjectSelector
              subjects={subjects}
              selectedSubject={selectedSubject}
              onSelectSubject={handleSubjectChange}
            />
          </div>
        </div>

        <div className="tabs tabs-boxed">
          <a className={`tab ${activeTab === "overview" ? "tab-active" : ""}`} onClick={() => setActiveTab("overview")}>
            Overview
          </a>
          <a
            className={`tab ${activeTab === "assessments" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("assessments")}
          >
            Assessments
          </a>
          <a
            className={`tab ${activeTab === "proficiency" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("proficiency")}
          >
            Proficiency
          </a>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title text-sm">Average Score</h3>
                    <BarChart className="h-4 w-4 text-base-content opacity-70" />
                  </div>
                  <div className="text-2xl font-bold">{performanceMetrics.average_score}%</div>
                  <p className="text-xs opacity-70">Across all assessments</p>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title text-sm">Completion Rate</h3>
                    <Clock className="h-4 w-4 text-base-content opacity-70" />
                  </div>
                  <div className="text-2xl font-bold">{performanceMetrics.assessment_completion_rate}%</div>
                  <p className="text-xs opacity-70">Of assigned assessments</p>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="card-title text-sm">Assessments Taken</h3>
                    <BookOpen className="h-4 w-4 text-base-content opacity-70" />
                  </div>
                  <div className="text-2xl font-bold">{performanceMetrics.total_assessments_taken}</div>
                  <p className="text-xs opacity-70">Total completed assessments</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="card bg-base-200 shadow-xl col-span-4">
                <div className="card-body">
                  <h2 className="card-title">Performance Metrics</h2>
                  <PerformanceMetrics metrics={performanceMetrics} />
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl col-span-3">
                <div className="card-body">
                  <h2 className="card-title">Recent Assessments</h2>
                  <p className="text-sm opacity-70">Your most recent examination and practice assessments</p>
                  <RecentAssessments
                    examinations={recentAssessments.examinations.slice(0, 3)}
                    practices={recentAssessments.practices.slice(0, 3)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">All Assessments</h2>
              <p className="text-sm opacity-70">View all your completed and pending assessments</p>
              <RecentAssessments
                examinations={recentAssessments.examinations}
                practices={recentAssessments.practices}
                showAll={true}
              />
            </div>
          </div>
        )}

        {activeTab === "proficiency" && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Topic Proficiency</h2>
              <p className="text-sm opacity-70">
                Your proficiency levels across different topics
                {selectedSubject && ` in ${selectedSubject}`}
              </p>
              <ProficiencyChart proficiencyData={proficiencyData} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
