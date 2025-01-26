import React from "react";
import { useForm, router } from "@inertiajs/react";

const StudentInputCode = () => {
    const { data, setData, post, errors } = useForm({
        code: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/assessment/join");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card w-full max-w-md shadow-2xl bg-base-100">
                <div className="card-body">
                    <h1 className="card-title text-center">Join Assessment</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-control mb-4">
                            <label htmlFor="code" className="label">
                                <span className="label-text">
                                    Enter Access Code
                                </span>
                            </label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                value={data.code}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                                className="input input-bordered"
                                placeholder="Enter your access code"
                                required
                            />
                            {errors.code && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.code}
                                </p>
                            )}
                        </div>
                        <div className="form-control mt-6">
                            <button
                                type="submit"
                                className="btn btn-primary bg-black hover:bg-green-800 border-none"
                            >
                                Join Assessment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentInputCode;
