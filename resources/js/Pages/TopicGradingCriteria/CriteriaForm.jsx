import React from "react";
import { useForm, usePage, Link } from "@inertiajs/react";

const CriteriaForm = () => {
    const { topic, criteria } = usePage().props;

    // Add this debug logging
    // console.log("Criteria prop:", criteria);
    // console.log("Topic prop:", topic);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        criteria: criteria
            ? criteria.map((c) => ({
                  difficulty: c.difficulty,
                  percentage: c.percentage,
                  min_questions: c.min_questions,
              }))
            : [
                  {
                      difficulty: "remembering",
                      percentage: "",
                      min_questions: "",
                  },
                  {
                      difficulty: "understanding",
                      percentage: "",
                      min_questions: "",
                  },
                  { difficulty: "applying", percentage: "", min_questions: "" },
                  {
                      difficulty: "analyzing",
                      percentage: "",
                      min_questions: "",
                  },
                  {
                      difficulty: "evaluating",
                      percentage: "",
                      min_questions: "",
                  },
                  { difficulty: "create", percentage: "", min_questions: "" },
              ],
    });

    const handleChange = (index, field, value) => {
        const newCriteria = [...data.criteria];
        newCriteria[index][field] = value;
        setData("criteria", newCriteria);
    };

    //console.log(topic.id);
    //console.log(criteria.id);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data.criteria);

        if (criteria && criteria.length > 0) {
            // Make sure we're accessing the first criteria's ID if it's an array
            const criteriaId = criteria[0].id;
            //console.log("Updating with criteria ID:", criteriaId);
            put(
                `/topic-grading-criteria/update/criteria/${topic.id}/${criteriaId}`
            );
        } else {
            //console.log("Creating new criteria");
            post(`/topic-grading-criteria/create/criteria/${topic.id}`, {
                onSuccess: () => reset(),
                onError: (e) => console.log("Error:", e),
            });
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
        <div className="p-4">
            {/* Breadcrumbs */}
            <div className="text-sm breadcrumbs mb-4">
                <ul>
                    <li>
                        <Link href="/topic-grading-criteria/index">
                            Topic Grading Criteria List
                        </Link>
                    </li>
                    <li>
                        <a>Topic Criteria Form</a>
                    </li>
                </ul>
            </div>

            <div className="my-2 overflow-x-auto lg:mx-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 flex flex-row justify-between items-center">
                        <h2 className="text-xl font-bold">
                            Topic Criteria Form
                        </h2>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn border-none bg-[#303030] text-white hover:bg-green-600"
                        >
                            Save
                        </button>
                    </div>
                    <div>
                        {errors.criteria && <div>{errors.criteria}</div>}
                        <table className="table-md bg-white shadow-md rounded-md border-2 border-collapse border-gray-200">
                            <thead className="bg-[#64946a] text-white">
                                <tr className="border-b-2 border-gray-200">
                                    <th className="border border-gray-200 p-2">
                                        Difficulty
                                    </th>
                                    <th className="border border-gray-200 p-2">
                                        Percentage (%)
                                    </th>
                                    <th className="border border-gray-200 p-2">
                                        Minimum Questions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.criteria.map((criterion, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-[#94b398]"
                                    >
                                        <td className="border border-gray-200 p-2">
                                            {criterion.difficulty}
                                        </td>
                                        <td className="border border-gray-200 p-2">
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
                                                className="w-full hover:bg-[#94b398]"
                                            />
                                        </td>
                                        <td className="border border-gray-200 p-2">
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
                                                className="w-full hover:bg-[#94b398]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-[#64946a] hover:bg-[#64946a] text-white">
                                    <td className="border border-gray-200 p-2">
                                        Total Values
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                        {totalPercentage}
                                    </td>
                                    <td className="border border-gray-200 p-2">
                                        {totalMinQuestions}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CriteriaForm;
