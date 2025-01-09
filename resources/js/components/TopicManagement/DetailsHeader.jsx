import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const DetailsHeader = ({ subject, handleModal }) => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-row justify-between lg:justify-normal lg:space-x-8 items-center">
                <h1 className="text-2xl font-bold">Topic Details</h1>
                <button
                    onClick={handleModal}
                    className="btn border-none bg-[#303030] text-white hover:bg-[#42604C]"
                >
                    + Add new Topic
                </button>
            </div>
            <div className="text-black mt-4 space-x-4 flex flex-row">
                <h2>Subject Name: {subject.name}</h2>
                <h2>Subject Code: {subject.subject_id}</h2>
            </div>
        </div>
    );
};

export default DetailsHeader;
