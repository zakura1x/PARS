import React from "react";
import { usePage, router, Link } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AssessmentResults = () => {
    const {
        assessment,
        students,
        totalStudents,
        averageScore,
        highestScore,
        lowestScore,
        scoreDistribution,
    } = usePage().props;

    // Prepare data for the bar chart
    const chartData = {
        labels: Object.keys(scoreDistribution || {}).map(
            (range) => `${range}-${parseInt(range) + 10}%`
        ),
        datasets: [
            {
                label: "Number of Students",
                data: Object.values(scoreDistribution || {}).map(Number),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Ensure chart fits in mobile view
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Score Distribution",
            },
        },
    };

    const handleRowClick = (studentId) => {
        router.visit(
            `/assessment/${assessment.id}/student/prof/view/${studentId}`
        );
    };

    //console.log(assessment.id);

    return (
        <div className="p-4 bg-gray-200 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
                {assessment.title} - Results
            </h1>

            {/* Class Performance and Score Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Class Performance
                    </h2>
                    <button className="btn btn-primary text-white">
                        <Link
                            href={`/assessment/${assessment.id}/item-analysis`}
                        >
                            Item Analysis
                        </Link>
                    </button>
                    <div className="space-y-2 text-gray-600">
                        <p>Total Students: {totalStudents}</p>
                        <p>
                            Average Score:{" "}
                            {!isNaN(averageScore)
                                ? averageScore.toFixed(2)
                                : "N/A"}
                            %
                        </p>
                        <p>
                            Highest Score:{" "}
                            {!isNaN(highestScore)
                                ? highestScore.toFixed(2)
                                : "N/A"}
                            %
                        </p>
                        <p>
                            Lowest Score:{" "}
                            {!isNaN(lowestScore)
                                ? lowestScore.toFixed(2)
                                : "N/A"}
                            %
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">
                        Score Distribution
                    </h2>
                    <div className="h-64 md:h-80">
                        {/* Fixed height for responsiveness */}
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Student Results Table */}
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Student Results
            </h2>
            <div className="overflow-x-auto rounded-lg shadow-sm">
                <div className="max-h-96 overflow-y-auto">
                    {/* Set fixed height and enable vertical scrolling */}
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Student ID
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Correct Answers
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Total Questions
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Score (%)
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {students.map((student) => {
                                const score = parseFloat(
                                    student.latest_result?.score
                                );
                                const correctAnswers = parseInt(
                                    student.latest_result?.correct_answers
                                );
                                const totalQuestions = parseInt(
                                    student.latest_result?.total_questions
                                );

                                return (
                                    <tr
                                        key={student.id}
                                        onClick={() =>
                                            handleRowClick(student.id)
                                        }
                                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {student.id}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {!isNaN(correctAnswers)
                                                ? correctAnswers
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {!isNaN(totalQuestions)
                                                ? totalQuestions
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {!isNaN(score)
                                                ? score.toFixed(2)
                                                : "N/A"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AssessmentResults;
