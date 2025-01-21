import React, { useState } from "react";
import { usePage, router, useForm } from "@inertiajs/react";

const QuestionUpload = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        file: null,
    });
    const [downloadLink, setDownloadLink] = useState(null);

    const handleFileChange = (e) => {
        setData("file", e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("question-mass.upload"), {
            onSuccess: () => reset(),
        });
    };

    const handleDownloadTemplate = () => {
        //NEeds replacement
        setDownloadLink("/download-question-template");
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">
                    Upload Question File
                </h2>

                {/* Upload Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="file"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Select a Excel file
                        </label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept=".xls, .xlsx"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            onChange={handleFileChange}
                        />
                        {errors.file && (
                            <span className="text-red-500 text-sm">
                                {errors.file}
                            </span>
                        )}
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md disabled:opacity-50"
                        >
                            {processing ? "Uploading..." : "Upload File"}
                        </button>
                    </div>
                </form>

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
                    {downloadLink && (
                        <div className="mt-2">
                            <a
                                href={downloadLink}
                                download
                                className="text-blue-600"
                            >
                                Click here to download the template
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionUpload;
