import React from "react";
import { Link } from "@inertiajs/react";

const TOSView = ({ topics, tosRecords, subjectId }) => {
    return (
        <div className="container mx-auto p-4">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <Link href="/table-of-specification/index">
                            Table of Specification List
                        </Link>
                    </li>
                    <li>
                        <a>TOS View</a>
                    </li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-4">
                Table of Specification (TOS)
            </h1>

            {/* Displaying Subject Information */}
            <div className="mb-4">
                <h2 className="text-lg font-semibold">
                    Subject ID: {subjectId}
                </h2>
            </div>

            {/* TOS Table */}
            <div className="overflow-x-auto">
                <table className="table w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 text-slate-500">
                            <th>Topic Name</th>
                            <th>Remembering</th>
                            <th>Understanding</th>
                            <th>Applying</th>
                            <th>Analyzing</th>
                            <th>Evaluating</th>
                            <th>Creating</th>
                            <th>Percentage</th>
                            <th>Total # of Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tosRecords.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center p-4">
                                    No TOS records found for this subject.
                                </td>
                            </tr>
                        ) : (
                            tosRecords.map((tos) => (
                                <tr key={tos.id}>
                                    <td>{tos.topic?.name}</td>
                                    <td>{tos.difficulty.remembering || 0}</td>
                                    <td>{tos.difficulty.understanding || 0}</td>
                                    <td>{tos.difficulty.applying || 0}</td>
                                    <td>{tos.difficulty.analyzing || 0}</td>
                                    <td>{tos.difficulty.evaluating || 0}</td>
                                    <td>{tos.difficulty.creating || 0}</td>
                                    <td>{tos.percentage}</td>
                                    <td>{tos.num_questions}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TOSView;
