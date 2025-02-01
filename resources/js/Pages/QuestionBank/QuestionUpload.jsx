import React, { useState, useRef } from "react";
import { usePage, router, useForm } from "@inertiajs/react";

const QuestionUpload = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        file: null,
    });
    const [downloadLink, setDownloadLink] = useState(null);

    const fileInputRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setData("file", e.target.files[0]);
            handleSubmit(); // Automatically submit the form
        }
    };

    const handleSubmit = () => {
        post(route("question-mass.upload"), {
            onSuccess: () => reset(),
        });
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => {
        setDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length > 0) {
            setData("file", e.dataTransfer.files[0]);
            handleSubmit();
        }
    };

    const handleDownloadTemplate = () => {
        setDownloadLink("/download-question-template");
        window.location.href = "/download-question-template"; // Automatically redirect to download the template
    };

    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-[70%]">
            <div
                className={`max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md ${
                    dragging ? "border-2 border-indigo-600" : ""
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <h2 className="text-xl font-semibold mb-4">
                    Upload Question File
                </h2>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept=".xls, .xlsx"
                    onChange={handleFileChange}
                />
                <div className="mb-4">
                    <button
                        type="button"
                        disabled={processing}
                        onClick={handleButtonClick}
                        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md disabled:opacity-50"
                    >
                        {processing ? "Uploading..." : "Upload File"}
                    </button>
                </div>

                {/* Download Template Section */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Download Template
                    </h2>
                    <button
                        onClick={handleDownloadTemplate}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md"
                    >
                        Download Template
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuestionUpload;
