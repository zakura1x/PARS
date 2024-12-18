import React, { useState } from "react";
import { usePage, Head, useForm, router } from "@inertiajs/react";
import Search from "../../components/QuestionBank/Search";
import Header from "../../components/QuestionBank/Header";
import QuestionTable from "../../components/QuestionBank/QuestionTable";

const QuestionIndex = () => {
    const { questions } = usePage().props;

    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    const handleSearch = () => {
        router.get(
            "/questionBank",
            {
                searchQuery,
                category,
                status,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Head title="Question Bank" />
            <Header />
            <Search
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                category={category}
                setCategory={setCategory}
                status={status}
                setStatus={setStatus}
                handleSearch={handleSearch}
            />
            <QuestionTable questions={questions} />
        </div>
    );
};

export default QuestionIndex;
