import React from "react";
import { GiNotebook } from "react-icons/gi";
import { Link } from "@inertiajs/react";

const StudentShowSubTopics = ({
    topic,
    subTopics = [],
    studyMaterials = [],
}) => {
    return (
        <div className="space-y-6 p-4">
            <h2 className="text-2xl font-bold">
                {topic.name || "Untitled Topic"}
            </h2>
            <hr className="border-gray-300" />

            {studyMaterials.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold">Study Materials</h3>
                    <ul className="menu bg-base-100 w-full rounded-box">
                        {studyMaterials.map((material) => (
                            <li key={material.id}>
                                <a
                                    href={
                                        material.attachments.length > 0
                                            ? material.attachments[0].public_url
                                            : "#"
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="link link-primary"
                                >
                                    {material.title || "Untitled Material"}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {subTopics.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold">Subtopics</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {subTopics.map((subtopic) => (
                            <Link
                                key={subtopic.id}
                                href={`/student/topics/${subtopic.id}`}
                                className="btn btn-outline flex items-center space-x-2"
                            >
                                <GiNotebook className="text-xl text-primary" />
                                <span>
                                    {subtopic.name || "Untitled Subtopic"}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {studyMaterials.length === 0 && subTopics.length === 0 && (
                <div className="alert alert-warning">
                    No study materials or subtopics available.
                </div>
            )}
        </div>
    );
};

export default StudentShowSubTopics;
