import React from "react";
import { FileText } from "lucide-react";
import { Link } from "@inertiajs/react";

export default function ExamAssessmentTracker({ assessments }) {
    return (
        <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
                <div className="flex items-center mb-4">
                    <FileText className="mr-2" size={20} />
                    <h2 className="card-title">EXAM ASSESSMENT TRACKER</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {assessments.map((a) => (
                            <tr key={a.id}>
                                <td>{a.name}</td>
                                <td className="flex items-center gap-2">
                                    <span>{a.submissions}</span>
                                    <Link
                                        href={`/assessment/edit/form/exam/${a.id}`}
                                        className="bg-green-800 text-white px-3 py-1 rounded inline-block hover:bg-green-900"
                                    >
                                        View
                                    </Link>
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

