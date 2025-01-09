import React from "react";

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <span className="loading loading-ring loading-lg"></span>
        </div>
    );
};

export default LoadingSpinner;
