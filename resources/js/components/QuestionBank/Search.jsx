import React from "react";

const Search = ({
    searchQuery,
    setSearchQuery,
    category,
    setCategory,
    status,
    setStatus,
    handleSearch,
}) => {
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div className="flex flex-col gap-4 md:m-4 shadow-md rounded-md bg-slate-50 p-4">
            {/* Search Input */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Query */}
                <div className="w-full lg:w-2/4 space-y-2">
                    <label className="font-medium text-[20px] px-2">
                        What are you looking for?
                    </label>
                    <input
                        type="text"
                        placeholder="Search Questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-green-500"
                    />
                </div>

                {/* Category */}
                <div className="w-full md:w-1/4 space-y-2">
                    <label className="font-medium text-[20px] px-2">
                        Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-md border p-2 text-slate-600 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm bg-white"
                    >
                        <option value="">All</option>
                        <option value="assessment">Assessment Question</option>
                        <option value="practice">Practice Question</option>
                        <option value="examination">
                            Examination Question
                        </option>
                    </select>
                </div>

                {/* Status */}
                <div className="w-full md:w-1/4 space-y-2">
                    <label className="font-medium text-[20px] px-2">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full rounded-md border p-2 text-slate-600 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-green-800 sm:text-sm bg-white"
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="approval">Approval Question</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>

                {/* Search Button */}
                <button
                    className="btn border-none bg-[#42604C] text-white hover:bg-gray-600 px-6 md:mt-6"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default Search;
