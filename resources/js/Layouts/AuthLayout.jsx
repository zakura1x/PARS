import React from "react";
import AuthHeader from "../components/AuthComponents/AuthHeader";
import AuthFooter from "../components/AuthComponents/AuthFooter";

const AuthLayout = ({ children }) => {
    return (
        <div className="h-screen flex flex-col">
            <AuthHeader />
            <div className="flex-grow">{children}</div>
            <AuthFooter />
        </div>
    );
};

export default AuthLayout;
