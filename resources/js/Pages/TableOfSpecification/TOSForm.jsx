import React, { useState, useEffect } from "react";
import { useForm, Link } from "@inertiajs/react";

const TOSForm = ({ topics, tosRecords, subjectId }) => {
    // Initial form data setup: prefill difficulty values if TOS records exist
    const { data, setData, post } = useForm({
        items: topics.map((topic) => {
            // Check if a TOS record already exists for the topic
            const existingTOS = tosRecords.find(
                (tos) => tos.topic_id === topic.id
            );
            return {
                topic_id: topic.id,
                topic_name: topic.name,
                difficulty: existingTOS
                    ? {
                          remembering: existingTOS.difficulty?.remembering ?? 0,
                          understanding:
                              existingTOS.difficulty?.understanding ?? 0,
                          applying: existingTOS.difficulty?.applying ?? 0,
                          analyzing: existingTOS.difficulty?.analyzing ?? 0,
                          evaluating: existingTOS.difficulty?.evaluating ?? 0,
                          creating: existingTOS.difficulty?.creating ?? 0,
                      }
                    : {
                          remembering: 0,
                          understanding: 0,
                          applying: 0,
                          analyzing: 0,
                          evaluating: 0,
                          creating: 0,
                      },
                percentage: existingTOS ? existingTOS.percentage : 0, // Default to 0 if no TOS record
            };
        }),
        subject_id: subjectId,
    });

    console.log(tosRecords);

    // Handle input changes
    const handleInputChange = (index, difficultyKey, value) => {
        const updatedData = [...data.items];
        updatedData[index].difficulty[difficultyKey] = parseInt(value) || 0;
        setData("items", updatedData);
    };

    // Handle percentage change
    const handlePercentageChange = (index, value) => {
        const updatedData = [...data.items];
        updatedData[index].percentage = parseInt(value) || 0;
        setData("items", updatedData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/table-of-specification/save/form");
    };

    return (
        <div className="container mx-auto p-4">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <Link href="/table-of-specification/index">
                            Table of Specification List
                        </Link>
                    </li>
                    <li>
                        <a>TOS View</a>
                    </li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-4">Table of Specification</h1>
            <form onSubmit={handleSubmit}>
                <div className="overflow-x-auto">
                    <table className="table w-full border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100 text-slate-500">
                                <th>Topic Name</th>
                                <th>Remembering</th>
                                <th>Understanding</th>
                                <th>Applying</th>
                                <th>Analyzing</th>
                                <th>Evaluating</th>
                                <th>Creating</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((topic, index) => (
                                <tr key={topic.topic_id}>
                                    <td className="p-2">{topic.topic_name}</td>
                                    {Object.keys(topic.difficulty).map(
                                        (difficultyKey) => (
                                            <td
                                                key={difficultyKey}
                                                className="p-2"
                                            >
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        topic.difficulty[
                                                            difficultyKey
                                                        ]
                                                    }
                                                    onChange={(e) =>
                                                        handleInputChange(
                                                            index,
                                                            difficultyKey,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="input input-bordered input-sm w-full bg-white"
                                                />
                                            </td>
                                        )
                                    )}
                                    <td className="p-2">
                                        <input
                                            type="number"
                                            min="0"
                                            value={topic.percentage}
                                            onChange={(e) =>
                                                handlePercentageChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            className="input input-bordered input-sm w-full bg-white"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 justify-end flex">
                    <button
                        type="submit"
                        className="btn bg-green-700 text-white border-none hover:bg-black"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TOSForm;
