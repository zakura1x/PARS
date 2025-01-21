import React from "react";
import { Link } from "@inertiajs/react";
import { SlOptionsVertical } from "react-icons/sl";
import FlashMessage from "../../components/Notifications/FlashMessage";
import Pagination from "../../components/misc/Pagination";

const AssessmentIndex = ({ assessments }) => {
    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <FlashMessage message={flash.message}></FlashMessage>
            <h1 className="text-2xl font-bold mb-4">Assessments</h1>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Subject</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.map((assessment) => (
                            <tr key={assessment.id}>
                                <td>{assessment.title}</td>
                                <td>{assessment.subject.name}</td>
                                <td>{assessment.status}</td>
                                <td>
                                    <div className="dropdown">
                                        <div
                                            tabIndex={0}
                                            role="button"
                                            className="btn btn-ghost btn-sm"
                                        >
                                            <SlOptionsVertical />
                                        </div>
                                        <ul
                                            tabIndex={0}
                                            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                                        >
                                            <li>
                                                <Link
                                                    href={`/assessments/${assessment.id}/edit`}
                                                >
                                                    Edit
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/assessments/${assessment.id}`}
                                                >
                                                    View
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={`/assessments/${assessment.id}/delete`}
                                                >
                                                    Delete
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination data={assessments} onPageChange={handlePageChange} />
        </div>
    );
};

export default AssessmentIndex;
