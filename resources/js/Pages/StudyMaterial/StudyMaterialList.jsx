import React from "react";
import { usePage, Link } from "@inertiajs/react";

const StudyMaterialList = () => {
    const { flash, studyMaterials, topic, subject } = usePage().props;

    return (
        <div className="p-4 bg-white rounded shadow m-2">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <a>Class</a>
                    </li>
                    <li>
                        <Link href="/topic/lists">Topic List</Link>
                    </li>
                    <li>
                        <Link href={`/topics/view/details/${subject.id}`}>
                            Topic Details
                        </Link>
                    </li>
                    <li>
                        <Link href={`/topics/edit/${topic.id}`}>
                            Subtopics ({topic.name})
                        </Link>
                    </li>
                    <li>
                        <a>Study Materials</a>
                    </li>
                </ul>
            </div>
            {/* Breadcrumbs */}
        </div>
    );
};

export default StudyMaterialList;
