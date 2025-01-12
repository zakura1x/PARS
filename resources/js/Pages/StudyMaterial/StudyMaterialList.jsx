import React from "react";
import { usePage, Link } from "@inertiajs/react";
import FlashMessage from "../../components/Notifications/FlashMessage";

const StudyMaterialList = () => {
    const { flash, studyMaterials, topic, subject } = usePage().props;

    return (
        <div className="p-4 bg-white rounded shadow m-2">
            <FlashMessage message={flash.message} />
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
            {/* Header */}
            <div className="flex flex-row space-x-4 items-center">
                <h4>Study Materials of {topic.name}</h4>
                <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]">
                    <Link href={`/study-materials/add/form/${topic.id}`}>
                        Add new Material
                    </Link>
                </button>
            </div>

            {/* Content */}
            <div className="mt-4">
                {studyMaterials.length === 0 ? (
                    <div className="text-center p-4 bg-gray-50 rounded">
                        <p className="text-gray-500">
                            No study materials available.
                        </p>
                    </div>
                ) : (
                    studyMaterials.map((material) => (
                        <div key={material.id} className="mb-4">
                            <div className="flex justify-between bg-gray-200 p-4 rounded-lg border-none">
                                <div className="collapse rounded-lg">
                                    <input type="checkbox" />
                                    <div className="collapse-title text-xl font-medium rounded-lg">
                                        {material.title}
                                    </div>
                                    <div className="collapse-content">
                                        <div className="flex flex-row justify-between items-center">
                                            <p>{material.content}</p>
                                        </div>
                                        {material.attachments &&
                                            material.attachments.length > 0 && (
                                                <div className="mt-2">
                                                    <h4 className="font-medium">
                                                        Attachments:
                                                    </h4>
                                                    <ul className="list-disc ml-4">
                                                        {material.attachments.map(
                                                            (attachment) => (
                                                                <li
                                                                    key={
                                                                        attachment.id
                                                                    }
                                                                >
                                                                    {
                                                                        attachment.file_name
                                                                    }
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        {material.links &&
                                            material.links.length > 0 && (
                                                <div className="mt-2">
                                                    <h4 className="font-medium">
                                                        Links:
                                                    </h4>
                                                    <ul className="list-disc ml-4">
                                                        {material.links.map(
                                                            (link, index) => (
                                                                <li key={index}>
                                                                    <a
                                                                        href={
                                                                            link
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {link}
                                                                    </a>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                    </div>
                                </div>
                                <div className="flex flex-row space-x-4 mr-6">
                                    <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]">
                                        <Link
                                            href={`/study-materials/edit/${material.id}`}
                                        >
                                            Edit Material
                                        </Link>
                                    </button>
                                    <button className="btn border-none bg-[#303030] text-white hover:bg-red-500">
                                        <Link href={`/`}>Delete</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudyMaterialList;
