import React from "react";
import { useForm, router } from "@inertiajs/react";

const CriteriaSearchTopics = ({ subjects, search, subjectId }) => {
    const { data, setData, get } = useForm({
        search: search || "",
        subject_id: subjectId || "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get("/topic-grading-criteria/index");
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                value={data.search}
                onChange={(e) => setData("search", e.target.value)}
                placeholder="Search topics..."
            />
            <select
                value={data.subject_id}
                onChange={(e) => setData("subject_id", e.target.value)}
            >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                        {subject.name}
                    </option>
                ))}
            </select>
            <button
                type="submit"
                className="btn border-none bg-black text-white hover:bg-green-900 "
            >
                Search
            </button>
        </form>
    );
};

export default CriteriaSearchTopics;
