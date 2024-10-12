import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

const Login = ({ errors: serverErrors }) => {
    const { data, setData, post, processing } = useForm({
        emailOrStudentNumber: "", // changed from email to emailOrStudentNumber
        password: "",
    });

    // Local state to track client-side validation errors
    const [errors, setErrors] = useState({});

    // Regular expression for validating email and student number
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    const studentNumberRegex = /^[A-Z0-9]{2}-[A-Z0-9]{5}$/; // Example: XX-XXXXX

    function submit(e) {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Client-side validation
        let newErrors = {};
        const { emailOrStudentNumber, password } = data;

        // Validate email or student number
        if (
            !emailRegex.test(emailOrStudentNumber) &&
            !studentNumberRegex.test(emailOrStudentNumber)
        ) {
            newErrors.emailOrStudentNumber =
                "Please enter a valid email or student number (XX-XXXXX).";
        }

        // Validate password
        if (!password) {
            newErrors.password = "Password is required";
        }

        // If there are validation errors, don't submit the form
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // If no errors, submit the form
        post("/login");
    }

    return (
        <div className="h-full">
            <Head title="Login" />
            <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#FFF] to-[#258245] justify-center items-center h-full w-full">
                <div className="w-full lg:w-[35%] xl:w-[30%] p-4 mx-auto lg:ml-28 xl:ml-36">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="flex items-center justify-center flex-col mb-20">
                            <p className="font-poppins font-semibold text-[40px] text-[#14B56A]">
                                Welcome to PARS
                            </p>
                            <p className="font-semibold text-gray-400">
                                Login to your account
                            </p>
                        </div>
                        <form onSubmit={submit} className="text-black">
                            <div className="mb-4">
                                <label
                                    htmlFor="emailOrStudentNumber"
                                    className="block font-medium text-gray-400"
                                >
                                    Email or Student Number
                                </label>
                                <input
                                    type="text"
                                    id="emailOrStudentNumber"
                                    name="emailOrStudentNumber"
                                    value={data.emailOrStudentNumber}
                                    onChange={(e) =>
                                        setData(
                                            "emailOrStudentNumber",
                                            e.target.value
                                        )
                                    }
                                    className={`input input-bordered bg-white w-full border-[#9BB1AF] ${
                                        errors.emailOrStudentNumber
                                            ? "border-red-500"
                                            : ""
                                    }`}
                                />
                                {errors.emailOrStudentNumber && (
                                    <span className="text-red-500 text-sm">
                                        {errors.emailOrStudentNumber}
                                    </span>
                                )}
                                {serverErrors.emailOrStudentNumber && (
                                    <span className="text-red-500 text-sm">
                                        {serverErrors.emailOrStudentNumber}
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block font-medium text-gray-400"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className={`input input-bordered bg-white w-full border-[#9BB1AF] ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.password && (
                                    <span className="text-red-500 text-sm">
                                        {errors.password}
                                    </span>
                                )}
                                {serverErrors.password && (
                                    <span className="text-red-500 text-sm">
                                        {serverErrors.password}
                                    </span>
                                )}
                            </div>
                            <div className="block mt-4">
                                <label
                                    htmlFor="remember_me"
                                    className="inline-flex items-center"
                                >
                                    <input
                                        id="remember_me"
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        name="remember"
                                        value={data.remember || ""}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ml-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>
                            </div>
                            <div className="flex flex-row justify-between mt-4">
                                <a
                                    href="/password/reset"
                                    className="text-[#12AB63]"
                                >
                                    Forgot Password?
                                </a>
                                <button
                                    type="submit"
                                    className="text-white px-6 py-2 rounded-lg bg-[#12AB63]"
                                    disabled={processing}
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="hidden md:flex w-1/2 p-4 ml-36">
                    <div className="flex flex-col items-start justify-start h-full">
                        <p className="text-[48px] font-bold">
                            Personalized Accountancy
                        </p>
                        <p className="text-[48px] font-bold">Review System</p>
                        <p className="text-black italic text-[20px]">
                            excel beyond your dreams
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
