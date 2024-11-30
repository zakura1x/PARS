import React, { useState } from "react";

const SubjectList = ({ subjects: initialSubjects }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [subjects, setSubjects] = useState(initialSubjects);
    const [data, setData] = useState({
        subject_id: "",
        name: "",
        active: "true",
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e) => setSearch(e.target.value);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSave = async (e) => {
        e.preventDefault();
        // logic in storing to db
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value,
        });
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex justify-between items-center pb-4">
                    <h2 className="text-xl font-semibold">Subject Management</h2>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={handleSearch}
                            className="border rounded-lg px-4 py-2 w-40"
                        />
                        <button className="bg-red-400 text-white px-4 py-2 h-9 w-40 rounded hover:bg-red-500">
                            Delete
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 h-9 w-72 rounded hover:bg-green-600"
                            onClick={openModal}
                        >
                            + Add Subject
                        </button>
                    </div>
                </div>

                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2">
                                <input type="checkbox" />
                            </th>
                            <th className="border-b px-4 py-2">Subject ID</th>
                            <th className="border-b px-4 py-2">Subject Name</th>
                            <th className="border-b px-4 py-2">Created By</th>
                            <th className="border-b px-4 py-2">Active</th>
                            <th className="border-b px-4 py-2">Date Added</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects
                            .filter((subject) =>
                                subject.name.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((subject, index) => (
                                <tr key={index}>
                                    <td className="border-b px-4 py-2">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="border-b px-4 py-2">{subject.subject_id}</td>
                                    <td className="border-b px-4 py-2">{subject.name}</td>
                                    <td className="border-b px-4 py-2">{subject.created_by}</td>
                                    <td className="border-b px-4 py-2">
                                        {subject.active ? "Yes" : "No"}
                                    </td>
                                    <td className="border-b px-4 py-2">{new Date(subject.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-1/3">
                        <h3 className="text-lg font-semibold mb-4">Add New Subject</h3>
                        <form onSubmit={handleSave}>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    htmlFor="subjectId"
                                >
                                    Subject ID
                                </label>
                                <input
                                    type="text"
                                    id="subjectId"
                                    name="subject_id"
                                    value={data.subject_id}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2 ${
                                        errors.subject_id ? "border-red-500" : ""
                                    }`}
                                    placeholder="Enter Subject ID"
                                />
                                {errors.subject_id && (
                                    <span className="text-red-500 text-sm">
                                        {errors.subject_id}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-medium mb-2"
                                    htmlFor="subjectName"
                                >
                                    Subject Name
                                </label>
                                <input
                                    type="text"
                                    id="subjectName"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    className={`w-full border rounded-lg px-4 py-2 ${
                                        errors.name ? "border-red-500" : ""
                                    }`}
                                    placeholder="Enter Subject Name"
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm">
                                        {errors.name}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="active">
                                    Active
                                </label>
                                <select
                                    id="active"
                                    name="active"
                                    value={data.active}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-4 py-2"
                                >
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                {errors.active && (
                                    <span className="text-red-500 text-sm">{errors.active}</span>
                                )}
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectList;
