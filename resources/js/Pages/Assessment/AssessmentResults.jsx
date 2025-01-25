import React from "react";
import { usePage, router } from "@inertiajs/react";
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
        labels: Object.keys(scoreDistribution).map(
            (range) => `${range}-${parseInt(range) + 10}%`
        ),
        datasets: [
            {
                label: "Number of Students",
                data: Object.values(scoreDistribution),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
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

    // Function to handle row click
    const handleRowClick = (studentId) => {
        router.visit(`/assessment/${assessment.id}/student/${studentId}`);
    };

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">
                {assessment.name} - Results
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">
                        Class Performance
                    </h2>
                    <p>Total Students: {totalStudents}</p>
                    <p>Average Score: {averageScore.toFixed(2)}%</p>
                    <p>Highest Score: {highestScore.toFixed(2)}%</p>
                    <p>Lowest Score: {lowestScore.toFixed(2)}%</p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">
                        Score Distribution
                    </h2>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Student Results</h2>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Correct Answers</th>
                            <th>Total Questions</th>
                            <th>Score (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student) => (
                            <tr
                                key={student.id}
                                onClick={() => handleRowClick(student.id)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.results.correct_answers}</td>
                                <td>{student.results.total_questions}</td>
                                <td>
                                    {student.results.score_percentage.toFixed(
                                        2
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AssessmentResults;
