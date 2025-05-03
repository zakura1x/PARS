import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    ChevronDown,
    ChevronUp,
    FileText,
    ExternalLink,
    Book,
    File,
    Link as LinkIcon,
} from "lucide-react";

const StudentShowSubTopics = ({ currentTopic }) => {
    const { subjectName, subjectCode, subjectId } = usePage().props;
    const [expandedSubtopics, setExpandedSubtopics] = useState({});

    const toggleSubtopic = (id) => {
        setExpandedSubtopics((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const getFileIcon = (filename) => {
        if (!filename) return <File className="w-5 h-5" />;
        const extension = filename.split(".").pop().toLowerCase();
        switch (extension) {
            case "pdf":
                return <FileText className="w-5 h-5" />;
            case "doc":
            case "docx":
                return <FileText className="w-5 h-5 text-blue-600" />;
            case "xls":
            case "xlsx":
                return <FileText className="w-5 h-5 text-green-600" />;
            case "ppt":
            case "pptx":
                return <FileText className="w-5 h-5 text-red-600" />;
            default:
                return <File className="w-5 h-5" />;
        }
    };

    const renderLinks = (links) => {
        if (!links || links.length === 0) return null;

        return (
            <div className="ml-7 space-y-2 bg-gray-50 p-3 rounded-md mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                    External Links
                </h4>
                {links.map((link, index) => (
                    <div key={index} className="flex items-center text-sm">
                        <LinkIcon className="w-4 h-4 text-blue-500 mr-2" />
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex-1 truncate"
                        >
                            {link}
                        </a>
                        <ExternalLink className="w-4 h-4 text-gray-400 ml-2" />
                    </div>
                ))}
            </div>
        );
    };

    const renderMaterial = (material) => (
        <div
            key={material.id}
            className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
        >
            <div className="flex items-center mb-2">
                <FileText className="text-[#42604C] w-5 h-5 mr-2" />
                <h3 className="font-medium text-gray-700">{material.title}</h3>
            </div>

            {material.description && (
                <p className="text-sm text-gray-600 ml-7 mb-3">
                    {material.description}
                </p>
            )}

            {/* Render links if they exist */}
            {material.links &&
                material.links.length > 0 &&
                renderLinks(material.links)}

            {/* Render attachments if they exist */}
            {material.attachments?.length > 0 && (
                <div className="ml-7 space-y-2 bg-gray-50 p-3 rounded-md">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                        Attachments
                    </h4>
                    {material.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center text-sm">
                            {getFileIcon(attachment.filename)}
                            <a
                                href={attachment.public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:underline flex-1 truncate"
                            >
                                {attachment.filename || "Attachment"}
                            </a>
                            <ExternalLink className="w-4 h-4 text-gray-400 ml-2" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-200 min-h-screen shadow-md">
            {/* Breadcrumb Navigation */}
            <div className="mb-4 text-sm text-gray-600">
                <Link
                    href="/study-materials/index"
                    className="text-[#42604C] font-semibold hover:underline"
                >
                    Subjects
                </Link>
                <span className="mx-2 text-gray-400">{">"}</span>
                <Link
                    href={`/study-materials/view/${subjectId}`}
                    className="hover:text-[#42604C] font-semibold hover:underline"
                >
                    {subjectCode} - {subjectName}
                </Link>
                <span className="mx-2 text-gray-400">{">"}</span>
                <span className="text-gray-700">
                    {currentTopic?.name || "Topic"}
                </span>
            </div>

            {/* Current Topic Header */}
            <div className="bg-white p-6 rounded-md shadow-md">
                <h1 className="text-2xl font-bold text-gray-800">
                    {currentTopic?.name}
                </h1>
                <h4 className="text-gray-800">Study Materials</h4>
            </div>

            {/* Current Topic Study Materials */}
            {currentTopic?.studyMaterials?.length > 0 ? (
                <div className="bg-white p-6 rounded-md shadow-md">
                    <div className="space-y-2">
                        {currentTopic.studyMaterials.map(renderMaterial)}
                    </div>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-md shadow-md text-center text-gray-500 italic">
                    No study materials available for this topic.
                </div>
            )}

            {/* Subtopics Header */}
            <div className="bg-white p-6 rounded-md shadow-md">
                <h1 className="text-2xl font-bold text-gray-800">Subtopics</h1>
                <h4 className="text-gray-800">Study Materials</h4>
            </div>

            {/* Subtopics List */}
            <div className="space-y-4 shadow-md">
                {currentTopic?.subTopics?.length > 0 ? (
                    currentTopic.subTopics.map((subtopic) => (
                        <div
                            key={subtopic.id}
                            className="bg-white rounded-md shadow-sm overflow-hidden"
                        >
                            <div
                                className="flex items-center p-4 cursor-pointer"
                                onClick={() => toggleSubtopic(subtopic.id)}
                            >
                                <div className="bg-gray-200 rounded-full p-2 mr-3">
                                    <Book className="text-[#42604C] w-5 h-5" />
                                </div>
                                <span className="font-medium text-gray-800">
                                    {subtopic.name}
                                </span>
                                <div className="ml-auto">
                                    {expandedSubtopics[subtopic.id] ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>
                            </div>

                            {/* Subtopic Content */}
                            {expandedSubtopics[subtopic.id] && (
                                <div className="border-t border-gray-200">
                                    {subtopic.studyMaterials?.length > 0 ? (
                                        <div className="p-4">
                                            {subtopic.studyMaterials.map(
                                                renderMaterial
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500 italic">
                                            No study materials available for
                                            this subtopic.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg text-gray-600 italic shadow-sm">
                        No subtopics available.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentShowSubTopics;
