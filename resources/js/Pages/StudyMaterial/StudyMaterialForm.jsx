import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";

const StudyMaterialForm = ({ topicId, studyMaterial = null }) => {
    const [fileList, setFileList] = useState([]);
    const [linkInput, setLinkInput] = useState("");
    const [links, setLinks] = useState(
        studyMaterial ? studyMaterial.links : []
    );
    const [linkError, setLinkError] = useState("");
    const { data, setData, post, processing, errors, put } = useForm({
        title: studyMaterial ? studyMaterial.title : "",
        content: studyMaterial ? studyMaterial.content : "",
        attachments: [], // For new files only
        existingAttachments: studyMaterial
            ? studyMaterial.attachments.map((attachment) => attachment.id)
            : [],
        links: studyMaterial ? studyMaterial.links : [],
    });

    useEffect(() => {
        if (studyMaterial && studyMaterial.attachments) {
            setFileList(studyMaterial.attachments);
        }
    }, [studyMaterial]);

    const handleFileAdd = (e) => {
        const newFiles = Array.from(e.target.files);
        setFileList([...fileList, ...newFiles]);
        setData("attachments", [...data.attachments, ...newFiles]); // Keep track of new files
    };

    const removeFile = (indexToRemove) => {
        const updatedFiles = fileList.filter(
            (_, index) => index !== indexToRemove
        );
        setFileList(updatedFiles);
        setData((prevData) => ({
            ...prevData,
            attachments: updatedFiles,
        }));
    };

    const handleAddLink = (e) => {
        e.preventDefault();

        try {
            new URL(linkInput.trim());
            const newLinks = [...links, linkInput.trim()];
            setLinks(newLinks); // Update UI
            setData("links", newLinks); // Sync with form data
            setLinkInput("");
            setLinkError("");
        } catch (error) {
            setLinkError(
                "Please enter a valid URL (e.g., https://example.com)"
            );
        }
    };

    const removeLink = (indexToRemove) => {
        const updatedLinks = links.filter(
            (_, index) => index !== indexToRemove
        );
        setLinks(updatedLinks);
        setData("links", updatedLinks);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // Add title and content
        formData.append("title", data.title || ""); // Add fallback for safety
        formData.append("content", data.content || "");

        // Add existing attachments (if any)
        if (data.existingAttachments?.length > 0) {
            data.existingAttachments.forEach((id, index) => {
                formData.append(`existingAttachments[${index}]`, id);
            });
        }

        // Add new attachments
        if (data.attachments.length > 0) {
            data.attachments.forEach((file) => {
                formData.append("attachments[]", file);
            });
        }

        // Add links
        if (data.links.length > 0) {
            data.links.forEach((link, index) => {
                formData.append(`links[${index}]`, link);
            });
        }

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        if (studyMaterial) {
            put(`/study-materials/update/${studyMaterial.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onSuccess: () => console.log("Form updated successfully"),
                onError: (errors) =>
                    console.error("Form update failed:", errors),
            });
        } else {
            post(`/study-materials/add/new/${topicId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onSuccess: () => console.log("Form submitted successfully"),
                onError: (errors) =>
                    console.error("Form submission failed:", errors),
            });
        }
    };

    const handleCancel = () => {
        router.visit(route("study-materials.index", topicId));
    };

    return (
        <div className="p-6 bg-white rounded-md m-2 mt-4">
            <h2 className="text-2xl font-bold mb-6">
                {studyMaterial ? "Edit Study Material" : "Add Study Material"}
            </h2>

            <form onSubmit={handleSubmit} className="form-control">
                <div className="mb-4">
                    <label className="label" htmlFor="title">
                        <span className="label-text font-bold text-slate-600">
                            Title
                        </span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                        className="input input-bordered w-full"
                        required
                    />
                    {errors.title && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.title}
                            </span>
                        </label>
                    )}
                </div>

                <div className="mb-4">
                    <label className="label" htmlFor="content">
                        <span className="label-text font-bold text-slate-600">
                            Content
                        </span>
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        value={data.content}
                        onChange={(e) => setData("content", e.target.value)}
                        className="textarea textarea-bordered w-full bg-white"
                        rows="6"
                    />
                    {errors.content && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.content}
                            </span>
                        </label>
                    )}
                </div>

                <div className="mb-4">
                    <label className="label">
                        <span className="label-text font-bold text-slate-600">
                            Attachments
                        </span>
                    </label>
                    <div className="flex flex-col gap-4">
                        {/* File upload section */}
                        <div className="flex items-center space-x-2">
                            <label className="btn bg-black text-white hover:bg-green-800 border-none">
                                <span>Add Files</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileAdd}
                                    multiple
                                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                />
                            </label>
                            <span className="text-sm opacity-70">
                                Accepted files: JPG, JPEG, PNG, PDF, DOC, DOCX
                                (max 2MB)
                            </span>
                        </div>

                        {/* Link input section */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="url"
                                    value={linkInput}
                                    onChange={(e) =>
                                        setLinkInput(e.target.value)
                                    }
                                    placeholder="Enter resource URL"
                                    className={`input input-bordered flex-1 ${
                                        linkError ? "input-error" : ""
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddLink}
                                    className="btn bg-black text-white hover:bg-green-800 border-none"
                                >
                                    Add Link
                                </button>
                            </div>
                            {linkError && (
                                <span className="text-error text-sm">
                                    {linkError}
                                </span>
                            )}
                        </div>

                        {/* Display files */}
                        {fileList.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {fileList.map((file, index) => (
                                    <div
                                        key={`new-file-${index}`}
                                        className="flex items-center justify-between p-2 rounded bg-slate-100"
                                    >
                                        <span className="text-sm">
                                            📎 {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(index)}
                                            className="btn btn-ghost btn-sm text-error"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                {studyMaterial?.attachments.map(
                                    (attachment, index) => (
                                        <div
                                            key={`existing-file-${index}`}
                                            className="flex items-center justify-between p-2 rounded bg-slate-100"
                                        >
                                            <span className="text-sm">
                                                📎 {attachment.file_name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setData(
                                                        "existingAttachments",
                                                        data.existingAttachments.filter(
                                                            (id) =>
                                                                id !==
                                                                attachment.id
                                                        )
                                                    )
                                                }
                                                className="btn btn-ghost btn-sm text-error"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* Display links */}
                        {links.length > 0 && (
                            <div className="mt-2 space-y-2">
                                {links.map((link, index) => (
                                    <div
                                        key={`link-${index}`}
                                        className="flex items-center justify-between p-2 rounded bg-slate-100"
                                    >
                                        <span className="text-sm">
                                            🔗 {link}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeLink(index)}
                                            className="btn btn-ghost btn-sm text-error"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {errors.attachments && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.attachments}
                            </span>
                        </label>
                    )}
                    {errors.links && (
                        <label className="label">
                            <span className="label-text-alt text-error">
                                {errors.links}
                            </span>
                        </label>
                    )}
                </div>

                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-error text-white hover:bg-black border-none"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn bg-green-800 text-white border-none"
                    >
                        {processing ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Submitting...
                            </>
                        ) : (
                            "Submit"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default StudyMaterialForm;
