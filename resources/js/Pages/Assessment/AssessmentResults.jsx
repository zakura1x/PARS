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

    console.log(students);

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

    return (
        <div className="p-6 bg-base-100 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">
                {assessment.title} - Results
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">
                        Class Performance
                    </h2>
                    <p>Total Students: {totalStudents}</p>
                    <p>
                        Average Score:{" "}
                        {!isNaN(averageScore) ? averageScore.toFixed(2) : "N/A"}
                        %
                    </p>
                    <p>
                        Highest Score:{" "}
                        {!isNaN(highestScore) ? highestScore.toFixed(2) : "N/A"}
                        %
                    </p>
                    <p>
                        Lowest Score:{" "}
                        {!isNaN(lowestScore) ? lowestScore.toFixed(2) : "N/A"}%
                    </p>
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
                                    onClick={() => handleRowClick(student.id)}
                                    className="cursor-pointer hover:bg-gray-100"
                                >
                                    <td>{student.id}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        {!isNaN(correctAnswers)
                                            ? correctAnswers
                                            : "N/A"}
                                    </td>
                                    <td>
                                        {!isNaN(totalQuestions)
                                            ? totalQuestions
                                            : "N/A"}
                                    </td>
                                    <td>
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
    );
};

export default AssessmentResults;
