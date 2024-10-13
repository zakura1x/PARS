import { useState } from "react";
import AuthForm from "../../components/AuthComponents/AuthForm";

const Login = ({ errors: serverErrors }) => {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const loginFields = [
        {
            label: "Email or Student Number",
            name: "emailOrStudentNumber",
            type: "text",
            validation: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const studentNumberRegex = /^[A-Z0-9]{2}-[A-Z0-9]{5}$/;
                return emailRegex.test(value) || studentNumberRegex.test(value);
            },
        },
        {
            label: "Password",
            name: "password",
            type: "password",
            validation: (value) => value.length > 0,
        },
    ];

    const forgotPasswordFields = [
        {
            label: "Email",
            name: "email",
            type: "email",
            validation: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        },
    ];

    return (
        <div className="h-full">
            <div className="flex flex-col md:flex-row bg-gradient-to-b from-[#FFF] to-[#258245] justify-center items-center h-full w-full">
                <div className="w-full lg:w-[35%] xl:w-[30%] p-4 mx-auto lg:ml-28 xl:ml-36">
                    {!showForgotPassword ? (
                        <AuthForm
                            title="Welcome to PARS"
                            subtitle="Login to your account"
                            buttonLabel="Login"
                            postUrl="/login"
                            fields={loginFields}
                            serverErrors={serverErrors}
                            showForgotPassword={showForgotPassword}
                            toggleForm={() => setShowForgotPassword(true)}
                        />
                    ) : (
                        <AuthForm
                            title="Forgot Password?"
                            subtitle="Enter your email to reset your password"
                            buttonLabel="Send Reset Link"
                            postUrl="/resetPassword"
                            fields={forgotPasswordFields}
                            serverErrors={serverErrors}
                            showForgotPassword={showForgotPassword}
                            toggleForm={() => setShowForgotPassword(false)}
                        />
                    )}
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
