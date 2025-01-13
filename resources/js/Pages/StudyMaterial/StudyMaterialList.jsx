import React, { useState } from "react";
import { usePage, Link, router } from "@inertiajs/react";
import FlashMessage from "../../components/Notifications/FlashMessage";

const StudyMaterialList = () => {
    const { flash, studyMaterials, topic, subject } = usePage().props;
    const [materialToDelete, setMaterialToDelete] = useState(null);

    const openDeleteModal = (material) => {
        setMaterialToDelete(material);
        document.getElementById("delete_modal").showModal();
    };

    const handleDelete = () => {
        if (!materialToDelete) return;
        // Perform delete action
        router.delete(`/study-materials/add/new/${materialToDelete.id}`, {
            onSuccess: () => {
                console.log(`Deleted material with id: ${materialToDelete.id}`);
                // Optionally, close the modal and reset the state
                document.getElementById("delete_modal").close();
                setMaterialToDelete(null);
            },
            onError: (errors) => {
                console.error("Delete failed:", errors);
                // Handle errors here, e.g., show a flash message
            },
        });
    };

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
                                        <div>
                                            <p>Attachments:</p>
                                        </div>
                                        {material.attachments.map(
                                            (attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="mb-2"
                                                >
                                                    {attachment.public_url.endsWith(
                                                        ".jpg"
                                                    ) ||
                                                    attachment.public_url.endsWith(
                                                        ".jpeg"
                                                    ) ||
                                                    attachment.public_url.endsWith(
                                                        ".png"
                                                    ) ? (
                                                        <img
                                                            src={
                                                                attachment.public_url
                                                            }
                                                            alt={
                                                                attachment.file_name
                                                            }
                                                            className="w-64 h-auto rounded-lg shadow"
                                                        />
                                                    ) : (
                                                        <a
                                                            href={
                                                                attachment.public_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            Open File
                                                        </a>
                                                    )}
                                                </div>
                                            )
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
                                    <button
                                        className="btn border-none bg-[#303030] text-white hover:bg-red-500"
                                        onClick={() =>
                                            openDeleteModal(material)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Confirmation to delete */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                    <p className="py-4">
                        Are you sure you want to delete this study material?
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cancel</button>
                        </form>
                        <button
                            className="btn btn-error"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default StudyMaterialList;
