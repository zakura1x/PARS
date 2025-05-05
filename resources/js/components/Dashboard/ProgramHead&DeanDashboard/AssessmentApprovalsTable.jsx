import { usePage, Link } from "@inertiajs/react"

export default function AssessmentApprovals() {
  const { pendingAssessmentsList, metrics } = usePage().props
  const pendingAssessments = pendingAssessmentsList || []
  const pendingCount = metrics?.pendingAssessments || 0

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold mb-4">Assessment Approvals</h2>

      <div className="alert alert-warning mb-4">
        <p className="font-medium">You have {pendingCount} pending assessment approvals</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">ASSESSMENT NAME</th>
              <th className="pb-2">SUBJECT</th>
              <th className="pb-2">SUBMITTED BY</th>
              <th className="pb-2">DATE</th>
              <th className="pb-2">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pendingAssessments.length > 0 ? (
              pendingAssessments.map((assessment) => (
                <tr key={assessment.id} className="border-b">
                  <td className="py-3">{assessment.title}</td>
                  <td className="py-3">{assessment.subject?.name}</td>
                  <td className="py-3">{assessment.creator?.full_name}</td>
                  <td className="py-3">{new Date(assessment.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <Link
                      href={`/assessment/edit/form/exam/${assessment.id}`}
                      className="bg-green-800 text-white px-3 py-1 rounded mr-2 inline-block hover:bg-green-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center">
                  No pending assessments
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
