import React, { useState } from "react";
import { usePage, Head, useForm, router } from "@inertiajs/react";
import Search from "../../components/QuestionBank/Search";
import Header from "../../components/QuestionBank/Header";
import QuestionTable from "../../components/QuestionBank/QuestionTable";

const QuestionIndex = () => {
    const { questions } = usePage().props;
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Head title="Question Bank" />
            <Header />
            <Search />
            <QuestionTable questions={questions} />
        </div>
    );
};

export default QuestionIndex;
