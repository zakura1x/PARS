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
        <div className="container mx-auto p-4 max-w-3xl">
            <div className="text-sm breadcrumbs mb-6">
                <ul>
                    <li>
                        <Link href="/assessments" className="link link-hover">
                            Assessments
                        </Link>
                    </li>
                    <li>Create Assessment</li>
                </ul>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold mb-6">
                        Create New Assessment
                    </h2>

                    {errors.message && (
                        <div className="alert alert-error mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{errors.message}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label htmlFor="subject_id" className="label">
                                <span className="label-text">Subject</span>
                            </label>
                            <select
                                id="subject_id"
                                name="subject_id"
                                className="select select-bordered w-full"
                                value={data.subject_id}
                                onChange={(e) =>
                                    setData("subject_id", e.target.value)
                                }
                            >
                                <option value="">Select Subject</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.name}
                                    </option>
                                ))}
                            </select>
                            {formErrors.subject_id && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {formErrors.subject_id}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label htmlFor="title" className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                className="input input-bordered w-full"
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                            />
                            {formErrors.title && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {formErrors.title}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label htmlFor="description" className="label">
                                <span className="label-text">
                                    Description (Optional)
                                </span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                className="textarea textarea-bordered h-24"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />
                            {formErrors.description && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {formErrors.description}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label htmlFor="time_limit" className="label">
                                <span className="label-text">
                                    Time Limit (Minutes)
                                </span>
                            </label>
                            <input
                                id="time_limit"
                                type="number"
                                name="time_limit"
                                className="input input-bordered w-full"
                                value={data.time_limit}
                                onChange={(e) =>
                                    setData("time_limit", e.target.value)
                                }
                            />
                            {formErrors.time_limit && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {formErrors.time_limit}
                                    </span>
                                </label>
                            )}
                        </div>

                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary ${
                                    processing ? "loading" : ""
                                }`}
                                disabled={processing}
                            >
                                {processing
                                    ? "Creating..."
                                    : "Create Assessment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AssessmentGeneratorForm;
