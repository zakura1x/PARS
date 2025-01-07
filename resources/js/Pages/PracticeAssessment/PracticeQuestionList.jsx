import React from "react";
import { usePage } from "@inertiajs/react";

const PracticeQuestionList = () => {
    const { assessment } = usePage().props;

    return (
        <div>
            <h1>Practice Questions</h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Question Text</th>
                        <th>Difficulty</th>
                    </tr>
                </thead>
                <tbody>
                    {assessment.questions.map((q, index) => (
                        <tr key={q.id}>
                            <td>{index + 1}</td>
                            <td>
                                {q.question?.question_text ||
                                    "No question text available"}
                            </td>
                            <td>{q.question?.difficulty || "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PracticeQuestionList;
