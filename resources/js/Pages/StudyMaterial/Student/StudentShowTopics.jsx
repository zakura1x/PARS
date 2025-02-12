import React from "react";
import { GiNotebook } from "react-icons/gi";
import { Link } from "@inertiajs/react";

const StudentShowTopics = ({
    parentTopics = [],
    subTopics = [],
    isLoading,
}) => {
    console.log("parentTopics:", parentTopics);
    console.log("subTopics:", subTopics);

    const sortedParentTopics = Array.isArray(parentTopics)
        ? parentTopics.sort((a, b) => (a.order ?? a.id) - (b.order ?? b.id))
        : Object.values(parentTopics).sort(
              (a, b) => (a.order ?? a.id) - (b.order ?? b.id)
          );

    const subTopicsArray = Array.isArray(subTopics)
        ? subTopics
        : Object.values(subTopics);

    if (sortedParentTopics.length === 0) {
        return <p className="text-gray-500 italic">Loading topics...</p>;
    }

    return (
        <div className="p-6">
            <div className="space-y-4">
                {sortedParentTopics.length > 0 ? (
                    sortedParentTopics.map((topic) => (
                        <div
                            key={topic.id}
                            className={`p-4 rounded shadow ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold">
                                    {topic.name || "Untitled Topic"}
                                </h2>
                                <button className="btn border-none bg-[#303030] text-white hover:bg-[#42604C] mt-2">
                                    <Link
                                        href={`/study-materials/subtopic/${topic.id}`}
                                        className="text-white"
                                    >
                                        View Study Materials
                                    </Link>
                                </button>
                            </div>
                            <hr className="my-4 border-t-2 border-gray-400" />
                            <div className="mt-2 pl-6 text-slate-800">
                                {subTopicsArray.length > 0 &&
                                subTopicsArray.some(
                                    (st) => st.parent_id === topic.id
                                ) ? (
                                    subTopicsArray
                                        .filter(
                                            (st) => st.parent_id === topic.id
                                        )
                                        .map((subtopic) => (
                                            <div
                                                key={subtopic.id}
                                                className="flex items-center space-x-2"
                                            >
                                                <GiNotebook
                                                    className="text-xl"
                                                    color="#42604C"
                                                />
                                                <p>
                                                    {subtopic.name ||
                                                        "Untitled Subtopic"}
                                                </p>
                                            </div>
                                        ))
                                ) : (
                                    <div className="text-gray-500 italic">
                                        No subtopics found.
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 italic">
                        No topics available. Please add your topics.
                    </p>
                )}
            </div>
        </div>
    );
};

export default StudentShowTopics;
