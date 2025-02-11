const OptionsField = ({ data, setData, errors }) => {
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...data.options];
        updatedOptions[index] = value;
        setData("options", updatedOptions);
    };

    const handleAddOption = () => {
        setData("options", [...data.options, ""]);
    };

    const handleRemoveOption = (index) => {
        setData((prevData) => {
            const updatedOptions = prevData.options.filter(
                (_, i) => i !== index
            );
            const removedOption = prevData.options[index];

            return {
                ...prevData,
                options: updatedOptions,
                correct_answer: prevData.correct_answer.filter(
                    (ans) => ans !== removedOption
                ),
            };
        });
    };

    const toggleCorrectAnswer = (option) => {
        if (data.correct_answer.includes(option)) {
            setData(
                "correct_answer",
                data.correct_answer.filter((ans) => ans !== option)
            );
        } else {
            setData("correct_answer", [...data.correct_answer, option]);
        }
    };

    switch (data.format_type) {
        case "multiple_choice":
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Options
                    </label>
                    {data.options.map((option, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                checked={data.correct_answer.includes(option)}
                                onChange={() => toggleCorrectAnswer(option)}
                                className="checkbox checkbox-primary mr-2"
                            />
                            <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                    handleOptionChange(index, e.target.value)
                                }
                                className="input input-bordered w-full mr-2"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveOption(index)}
                                className="btn btn-error btn-sm"
                            >
                                Remove
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="btn btn-primary btn-sm mt-2"
                    >
                        Add Option
                    </button>
                </div>
            );
        case "true_or_false":
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Correct Answer (True/False)
                    </label>
                    <div className="mb-4">
                        <label className="label cursor-pointer">
                            <span className="label-text mr-2">True</span>
                            <input
                                type="radio"
                                name="correct_answer"
                                value="True"
                                checked={data.correct_answer.includes("True")}
                                onChange={() =>
                                    setData("correct_answer", ["True"])
                                }
                                className="radio radio-primary"
                            />
                        </label>
                        <label className="label cursor-pointer">
                            <span className="label-text mr-2">False</span>
                            <input
                                type="radio"
                                name="correct_answer"
                                value="False"
                                checked={data.correct_answer.includes("False")}
                                onChange={() =>
                                    setData("correct_answer", ["False"])
                                }
                                className="radio radio-primary"
                            />
                        </label>
                    </div>
                </div>
            );
        case "essay":
            return (
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Essay Answer
                    </label>
                    <textarea
                        name="essay_answer"
                        className="textarea textarea-bordered w-full"
                        disabled
                        placeholder="Answer will be written by the student."
                    ></textarea>
                </div>
            );
        default:
            return null;
    }
};

export default OptionsField;
