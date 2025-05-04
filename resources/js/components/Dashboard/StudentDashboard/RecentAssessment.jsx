import { useState } from "react"
import { format } from "date-fns"

export function RecentAssessments({ examinations, practices, showAll = false }) {
  const [activeTab, setActiveTab] = useState("examinations")

  return (
    <div className="w-full">
      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === "examinations" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("examinations")}
        >
          Examinations
        </a>
        <a className={`tab ${activeTab === "practices" ? "tab-active" : ""}`} onClick={() => setActiveTab("practices")}>
          Practice
        </a>
      </div>

      {activeTab === "examinations" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Completed</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {examinations.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    No examination assessments found
                  </td>
                </tr>
              ) : (
                examinations.map((exam) => (
                  <tr key={exam.id}>
                    <td className="font-medium">{exam.assessment.title}</td>
                    <td>{format(new Date(exam.completed_at), "PPpp")}</td>
                    <td className="text-right">
                      <span className={`badge ${getScoreBadgeColor(exam.result.score)}`}>{exam.result.score}%</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "practices" && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Submitted</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {practices.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    No practice assessments found
                  </td>
                </tr>
              ) : (
                practices.map((practice) => (
                  <tr key={practice.id}>
                    <td className="font-medium">{practice.subject.name}</td>
                    <td>{format(new Date(practice.submitted_at), "PPpp")}</td>
                    <td className="text-right">
                      <span className={`badge ${getScoreBadgeColor(practice.results.score_percentage)}`}>
                        {practice.results.score_percentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Helper function to determine badge color based on score
function getScoreBadgeColor(score) {
  if (score >= 90) return "badge-primary"
  if (score >= 70) return "badge-secondary"
  if (score >= 50) return "badge-accent"
  return "badge-error"
}
