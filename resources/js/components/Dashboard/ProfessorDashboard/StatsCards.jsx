export function StatsCards({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <Card
                title="ASSESSMENT'S APPROVAL"
                value={stats.pendingApprovals}
                color="text-red-500"
                label="PENDING"
            />
            <Card
                title="HIGH PROFICIENT STUDENTS"
                value={stats.highProficientStudents}
                color="text-green-500"
            />
            <Card
                title="ENROLLED STUDENTS"
                value={stats.enrolledStudents}
                color="text-yellow-500"
            />
            <Card
                title="STUDENTS NEED INTERVENTION"
                value={stats.studentsNeedIntervention}
                color="text-purple-500"
            />
            <Card
                title="COMPLETED ASSESSMENTS"
                value={stats.completedAssessments}
                color="text-blue-500"
            />
            <Card
                title="TOTAL TOPICS"
                value={stats.totalTopics}
                color="text-indigo-500"
            />
        </div>
    );
}
function Card({ title, value, color, label }) {
    return (
        <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-4 text-center">
                <div className="flex justify-center items-baseline space-x-1">
                    <span className={`text-6xl font-bold ${color}`}>
                        {value}
                    </span>
                    {label && (
                        <span className="text-s font-medium text-gray-500">
                            {label}
                        </span>
                    )}
                </div>

                <h2 className="text-sm font-bold opacity-70">{title}</h2>
            </div>
        </div>
    );
}
