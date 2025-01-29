import React from "react";
import { router } from "@inertiajs/react";

const StudentStudyMaterial = ({ subjects }) => {
    // Function to handle component click and redirect to studentShowTopics
    const handleComponentClick = (subjectId) => {
        router.visit(route("student-study-materials.show", subjectId));
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Subjects</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {subjects.map((subject) => (
                    <div
                        key={subject.id}
                        onClick={() => handleComponentClick(subject.id)}
                        className="p-4 border-none rounded-md shadow cursor-pointer hover:bg-green-700 hover:text-white "
                    >
                        <h2 className="text-lg font-medium">{subject.name}</h2>
                        <p className="text-sm text-gray-500">
                            {subject.subject_id}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentStudyMaterial;
