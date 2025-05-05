function StudentListTable({ students, onViewStudent }) {
    return (
        <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Student List</h2>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email Address</th>
                                <th>Ave. Score</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s) => (
                                <tr key={s.id}>
                                    <td>{s.name}</td>
                                    <td className="w-6 whitespace-normal break-words text-sm">
                                        {s.email}
                                    </td>
                                    <td>{s.averageScore} %</td>
                                    <td>
                                        <span
                                            className={`badge ${
                                                s.status === "good"
                                                    ? "badge-success"
                                                    : "badge-error"
                                            }`}
                                        >
                                            {s.status === "good"
                                                ? "Good Standing"
                                                : "Needs Intervention"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="bg-green-800 text-white px-3 py-1 rounded mr-2"
                                            onClick={() => onViewStudent(s.id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
