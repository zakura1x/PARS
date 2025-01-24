import React from "react";
import { Link } from "@inertiajs/react";
import { SlOptionsVertical } from "react-icons/sl";

const TOSIndex = ({ subjects }) => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Subjects</h1>
            <div className="overflow-x-auto">
                <table className="table w-full border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th>#</th>
                            <th>Subject Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.length > 0 ? (
                            subjects.map((subject, index) => (
                                <tr
                                    key={subject.id}
                                    className={
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-50"
                                    }
                                >
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2">{subject.name}</td>
                                    <td className="p-2">
                                        <Link
                                            href={`/table-of-specification/view/${subject.id}`}
                                            className="btn btn-primary btn-sm text-white m-1"
                                        >
                                            View TOS
                                        </Link>
                                        <Link
                                            href={`/table-of-specification/forms/${subject.id}`}
                                            className="btn btn-primary btn-sm m-1 text-white"
                                        >
                                            Update TOS
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="p-4 text-center text-gray-500"
                                >
                                    No subjects available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TOSIndex;
