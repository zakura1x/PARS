import { useState, useRef, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Upload, Download, CheckCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MassUploadStudent = () => {
    const { data, setData, post, errors, processing, reset } = useForm({
        file: null,
    });
    const [downloadLink, setDownloadLink] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const fileInputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            setData("file", e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        post(route("student.mass.upload"), {
            onSuccess: () => {
                reset();
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
            },
        });
    };

    // Watch for changes in `data.file`
    useEffect(() => {
        if (data.file) {
            handleSubmit();
        }
    }, [data.file]);

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
        setDownloadLink("/students/export-template");
        window.location.href = "/students/export-template";
    };

    return (
        <div className="p-6 flex flex-col items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center">
                        Students Mass Upload
                    </h2>
                    <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                            dragging
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border-base-300"
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xls, .xlsx"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center">
                                <Upload className="w-12 h-12 text-base-content opacity-50 mb-2" />
                                <span className="text-sm font-medium text-base-content opacity-70">
                                    Drag and drop your file here, or click to
                                    select
                                </span>
                            </div>
                        </label>
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            disabled={processing}
                            onClick={handleButtonClick}
                            className="btn btn-primary w-full"
                        >
                            {processing ? "Uploading..." : "Upload File"}
                        </button>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">
                            Download Template
                        </h3>
                        <button
                            onClick={handleDownloadTemplate}
                            className="btn btn-outline w-full"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download Template
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {uploadSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="toast toast-end"
                    >
                        <div className="alert alert-success">
                            <CheckCircle className="w-6 h-6" />
                            <span>File uploaded successfully.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {errors.file && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="toast toast-end"
                    >
                        <div className="alert alert-error">
                            <AlertCircle className="w-6 h-6" />
                            <span>{errors.file}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MassUploadStudent;