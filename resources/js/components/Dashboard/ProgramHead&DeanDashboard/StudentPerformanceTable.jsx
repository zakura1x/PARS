import { Users } from 'lucide-react'

export default function StudentPerformanceTable({ students }) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center mb-4">
          <Users className="mr-2" size={20} />
          <h2 className="card-title">STUDENT PERFORMANCE</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Ave. Score</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="flex items-center">
                    {s.name}
                    <div className={`w-3 h-3 rounded-full ml-2 ${s.status === "good" ? "bg-green-500" : "bg-red-500"}`}></div>
                  </td>
                  <td>{s.averageScore} %</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
