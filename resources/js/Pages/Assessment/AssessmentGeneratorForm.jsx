import React, { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";

const AssessmentGeneratorForm = ({ subjects, errors }) => {
    const {
        data,
        setData,
        post,
        processing,
        errors: formErrors,
    } = useForm({
        subject_id: "",
        title: "",
        description: "",
        time_limit: 60, // Default time limit
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/assessment/exam/create");
    };

    return (
        <div className="container mx-auto p-4">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <Link href="/assessments">Assessments</Link>
                    </li>
                    <li>Create Assessment</li>
                </ul>
            </div>

            <h1 className="text-2xl font-bold mb-4">Create New Assessment</h1>

            {/* Error Message */}
            {errors.message && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
                    {errors.message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="subject_id"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Subject
                    </label>
                    <select
                        id="subject_id"
                        name="subject_id"
                        className="select select-bordered w-full bg-white"
                        value={data.subject_id}
                        onChange={(e) => setData("subject_id", e.target.value)}
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                    {formErrors.subject_id && (
                        <p className="text-red-600 text-sm">
                            {formErrors.subject_id}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        name="title"
                        className="input input-bordered w-full"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                    />
                    {formErrors.title && (
                        <p className="text-red-600 text-sm">
                            {formErrors.title}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Description (Optional)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        className="textarea textarea-bordered w-full bg-white"
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    {formErrors.description && (
                        <p className="text-red-600 text-sm">
                            {formErrors.description}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="time_limit"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Time Limit (Minutes)
                    </label>
                    <input
                        id="time_limit"
                        type="number"
                        name="time_limit"
                        className="input input-bordered w-full"
                        value={data.time_limit}
                        onChange={(e) => setData("time_limit", e.target.value)}
                    />
                    {formErrors.time_limit && (
                        <p className="text-red-600 text-sm">
                            {formErrors.time_limit}
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={processing}
                    >
                        {processing ? "Creating..." : "Create Assessment"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssessmentGeneratorForm;
