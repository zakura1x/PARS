import { Head } from "@inertiajs/react";

const StatusBanner = ({ status }) => {
    const statusConfig = {
        waiting: { color: "info", text: "Waiting" },
        started: { color: "warning", text: "In Progress" },
        completed: { color: "success", text: "Completed" },
        timed_out: { color: "error", text: "Timed Out" },
    };

    const { color, text } = statusConfig[status] || {
        color: "ghost",
        text: "Unknown",
    };

    return <div className={`badge badge-${color} font-semibold`}>{text}</div>;
};

const AssessmentCard = ({ assessment }) => (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">{assessment.title}</h2>
            <p>{assessment.description}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-sm">
                    Questions: {assessment.questions_count}
                </span>
                <StatusBanner status={assessment.status} />
            </div>
        </div>
    </div>
);

const NoAssessmentsMessage = () => (
    <div className="alert bg-white shadow-lg">
        <div className="flex space-x-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current flex-shrink-0 w-6 h-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
            </svg>
            <span>No assessments available at the moment.</span>
        </div>
    </div>
);

export default function StudentAssessmentIndex({ assessments }) {
    return (
        <>
            <Head title="My Assessments" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">My Assessments</h1>
                {assessments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {assessments.map((assessment) => (
                            <AssessmentCard
                                key={assessment.id}
                                assessment={assessment}
                            />
                        ))}
                    </div>
                ) : (
                    <NoAssessmentsMessage />
                )}
            </div>
        </>
    );
}
