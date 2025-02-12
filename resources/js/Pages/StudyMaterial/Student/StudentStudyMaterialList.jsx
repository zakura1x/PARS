import React, { useState } from "react";

const StudentStudyMaterialList = ({ studyMaterials, topic, subject }) => {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
                {subject.name} - {topic.name}
            </h1>
            <div className="space-y-4">
                {studyMaterials.map((material) => (
                    <div
                        key={material.id}
                        className="collapse collapse-arrow bg-base-200 shadow-md"
                    >
                        {/* Collapsible Header */}
                        <input type="checkbox" />
                        <div className="collapse-title text-lg font-medium">
                            {material.title}
                        </div>

                        {/* Collapsible Content */}
                        <div className="collapse-content">
                            <p className="text-gray-700 mb-2">
                                {material.content}
                            </p>

                            {/* Attachments */}
                            {material.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                    <h3 className="font-semibold">
                                        Attachments:
                                    </h3>
                                    {material.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="mt-1"
                                        >
                                            {attachment.file_path.match(
                                                /\.(jpg|jpeg|png|gif)$/i
                                            ) ? (
                                                <div className="relative">
                                                    <img
                                                        src={
                                                            attachment.public_url
                                                        }
                                                        alt="Attachment"
                                                        className="w-full h-40 object-cover rounded cursor-pointer hover:scale-105 transition-transform duration-300"
                                                        onClick={() =>
                                                            window.open(
                                                                attachment.public_url,
                                                                "_blank"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <a
                                                    href={attachment.public_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-link text-blue-600"
                                                >
                                                    Open File
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Study Material Links */}
                            {material.links && material.links.length > 0 && (
                                <div className="mt-2">
                                    <h3 className="font-semibold">
                                        Related Links:
                                    </h3>
                                    <ul className="list-disc pl-5">
                                        {material.links.map((link, index) => (
                                            <li key={index}>
                                                <a
                                                    href={link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-link text-blue-600"
                                                >
                                                    {link}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentStudyMaterialList;
