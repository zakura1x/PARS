import React from "react";
import { useForm, usePage } from "@inertiajs/react";

const CriteriaForm = () => {
    const { topic, criteria } = usePage().props;

    const { data, setData, post, put, processing, errors } = useForm({
        criteria: criteria || [
            { difficulty: "remembering", percentage: "", min_questions: "" },
            { difficulty: "understanding", percentage: "", min_questions: "" },
            { difficulty: "applying", percentage: "", min_questions: "" },
            { difficulty: "analyzing", percentage: "", min_questions: "" },
            { difficulty: "evaluating", percentage: "", min_questions: "" },
            { difficulty: "creating", percentage: "", min_questions: "" },
        ],
    });

    const handleChange = (index, field, value) => {
        const newCriteria = [...data.criteria];
        newCriteria[index][field] = value;
        setData("criteria", newCriteria);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (criteria) {
            put(route("topic-grading-criteria.update", topic.id));
        } else {
            post(route("topic-grading-criteria.store", topic.id));
        }
    };

    const totalPercentage = data.criteria.reduce(
        (total, criterion) => total + parseInt(criterion.percentage || 0),
        0
    );
    const totalMinQuestions = data.criteria.reduce(
        (total, criterion) => total + parseInt(criterion.min_questions || 0),
        0
    );

    return (
        <div className="my-2 overflow-x-auto lg:mx-4">
            <form onSubmit={handleSubmit}>
                <h1>{topic.name}</h1>
                <table className="table-md bg-white shadow-md rounded-md">
                    <thead>
                        <tr>
                            <th>Difficulty</th>
                            <th>Percentage (%)</th>
                            <th>Minimum Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.criteria.map((criterion, index) => (
                            <tr key={index}>
                                <td>{criterion.difficulty}</td>
                                <td>
                                    <input
                                        type="number"
                                        value={criterion.percentage}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "percentage",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={criterion.min_questions}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "min_questions",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>Total Values</td>
                            <td>{totalPercentage}</td>
                            <td>{totalMinQuestions}</td>
                        </tr>
                    </tbody>
                </table>
                <button
                    type="submit"
                    disabled={processing}
                    className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                >
                    Submit
                </button>
                {errors.criteria && <div>{errors.criteria}</div>}
            </form>
        </div>
    );
};

export default CriteriaForm;
