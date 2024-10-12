import React from "react";
import AuthHeader from "../components/AuthComponents/AuthHeader";

const AuthLayout = ({ children }) => {
    return (
        <div className="h-screen flex flex-col">
            <AuthHeader />
            <div className="flex-grow">{children}</div>
        </div>
    );
};

export default AuthLayout;
