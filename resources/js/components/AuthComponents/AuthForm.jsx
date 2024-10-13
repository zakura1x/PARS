import { useForm } from "@inertiajs/react";
import { useState } from "react";

const AuthForm = ({
    title,
    subtitle,
    buttonLabel,
    postUrl,
    fields,
    serverErrors,
    showForgotPassword, // prop to show if it's in the forgot password form
    toggleForm, // function to toggle between login and forgot password
}) => {
    const { data, setData, post, processing } = useForm(
        fields.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
        }, {})
    );

    const [errors, setErrors] = useState({});

    function validate() {
        let newErrors = {};

        fields.forEach(({ name, validation }) => {
            if (validation && !validation(data[name])) {
                newErrors[name] = `Invalid ${name}`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Perform validation
        if (!validate()) return;

        // Submit the form
        post(postUrl);
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center flex-col mb-10">
                <p className="font-poppins font-semibold text-[40px] text-[#14B56A]">
                    {title}
                </p>
                <p className="font-semibold text-gray-400">{subtitle}</p>
            </div>
            <form onSubmit={handleSubmit} className="text-black">
                {fields.map(({ label, name, type }, index) => (
                    <div key={index} className="mb-4">
                        <label
                            htmlFor={name}
                            className="block font-medium text-gray-400"
                        >
                            {label}
                        </label>
                        <input
                            type={type}
                            id={name}
                            name={name}
                            value={data[name]}
                            onChange={(e) => setData(name, e.target.value)}
                            className={`input input-bordered bg-white w-full border-[#9BB1AF] ${
                                errors[name] ? "border-red-500" : ""
                            }`}
                        />
                        {errors[name] && (
                            <span className="text-red-500 text-sm">
                                {errors[name]}
                            </span>
                        )}
                        {serverErrors[name] && (
                            <span className="text-red-500 text-sm">
                                {serverErrors[name]}
                            </span>
                        )}
                    </div>
                ))}

                {/* Submit and toggle buttons */}
                <div className="flex justify-between mt-4">
                    <button
                        type="submit"
                        className="text-white px-6 py-2 rounded-lg bg-[#12AB63]"
                        disabled={processing}
                    >
                        {buttonLabel}
                    </button>
                    <button
                        type="button"
                        onClick={toggleForm}
                        className="text-[#12AB63] px-6 py-2 rounded-lg border border-[#12AB63] bg-transparent"
                    >
                        {showForgotPassword
                            ? "Back to Login"
                            : "Forgot Password?"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AuthForm;
