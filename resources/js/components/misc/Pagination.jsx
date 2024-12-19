import React from "react";

const Pagination = ({ data, onPageChange }) => {
    return (
        <div className="flex justify-between items-center mt-4">
            <span>
                Showing {data.from || 0} - {data.to || 0} of {data.total || 0}{" "}
                entries
            </span>
            <div className="flex items-center gap-2">
                {data.links.map((link, index) => (
                    <button
                        key={index}
                        className={`px-3 py-2 text-sm rounded-md border ${
                            link.active
                                ? "bg-green-900 text-white"
                                : "bg-white text-gray-600"
                        } ${!link.url && "cursor-not-allowed opacity-50"}`}
                        onClick={() => link.url && onPageChange(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Pagination;
