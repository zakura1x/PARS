import React from "react";
import { useForm } from "@inertiajs/react";

const CreateStudent = ({ setShowModal, showModal }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        idNumber: "",
        gender: "",
        birthdate: "",
        profilePhoto: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("student.add"), {
            onSuccess: () => setShowModal(false),
        });
    };

    const handleCancel = () => {
        reset();
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add New Student</h2>
            <form onSubmit={handleSubmit}>
                {/* Profile Photo */}
                <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                        {data.profilePhoto ? (
                            <img
                                src={data.profilePhoto}
                                alt="Profile"
                                className="rounded-full w-full h-full"
                            />
                        ) : (
                            "Photo"
                        )}
                    </div>
                    <div className="ml-4">
                        <label className="text-sm text-gray-600">
                            Profile photo
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setData(
                                    "profilePhoto",
                                    URL.createObjectURL(e.target.files[0])
                                )
                            }
                            className="text-sm text-gray-600 mt-1"
                        />
                    </div>
                </div>
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={data.first_name}
                            onChange={(e) =>
                                setData("first_name", e.target.value)
                            }
                            className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                errors.first_name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.first_name}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={data.last_name}
                            onChange={(e) =>
                                setData("last_name", e.target.value)
                            }
                            className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                errors.last_name
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.last_name}
                            </p>
                        )}
                    </div>
                </div>
                {/* Gender */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Gender
                        </label>
                        {/* <input
                            type="text"
                            value={data.gender}
                            onChange={(e) => setData("gender", e.target.value)}
                            className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                errors.gender
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        /> */}
                        <select
                            name="gender"
                            id="gender"
                            className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                errors.birthdate
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                            onChange={(e) => setData("gender", e.target.value)}
                        >
                            <option>Input your gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.gender}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            Birthdate
                        </label>
                        <input
                            type="date"
                            value={data.birthdate}
                            onChange={(e) =>
                                setData("birthdate", e.target.value)
                            }
                            className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                                errors.birthdate
                                    ? "border-red-500 focus:ring-red-500"
                                    : "focus:ring-blue-300"
                            }`}
                        />
                        {errors.birthdate && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.birthdate}
                            </p>
                        )}
                    </div>
                </div>
                {/* Email and Id Number */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                            errors.email
                                ? "border-red-500 focus:ring-red-500"
                                : "focus:ring-blue-300"
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        ID Number
                    </label>
                    <input
                        type="text"
                        placeholder="XX-XXXXX"
                        value={data.idNumber}
                        onChange={(e) => setData("idNumber", e.target.value)}
                        className={`block w-full rounded-md border p-2 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm bg-white ${
                            errors.idNumber
                                ? "border-red-500 focus:ring-red-500"
                                : "focus:ring-blue-300"
                        }`}
                    />
                    {errors.idNumber && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.idNumber}
                        </p>
                    )}
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                    <button
                        type="button"
                        className="btn border-none bg-gray-200 text-gray-700 hover:bg-gray-300"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn border-none bg-green-900  text-white hover:bg-[#303030]"
                        disabled={processing}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateStudent;
