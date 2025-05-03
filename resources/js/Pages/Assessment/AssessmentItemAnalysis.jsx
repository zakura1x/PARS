import React from "react";
import { Head, usePage } from "@inertiajs/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AssessmentItemAnalysis = () => {
    const { assessment, questions } = usePage().props;

    // Function to get the correct/wrong indicator icon
    const getIcon = (isCorrect) => (
        <span
            className={`text-lg font-bold ${
                isCorrect ? "text-green-600" : "text-red-600"
            }`}
        >
            {isCorrect ? "✔" : "✖"}
        </span>
    );

    const handlePrint = async () => {
        try {
            // Create a temporary div for printing
            const printElement = document.createElement("div");
            printElement.style.position = "absolute";
            printElement.style.left = "-9999px";
            printElement.style.width = "210mm"; // A4 width
            printElement.style.padding = "20px";
            printElement.style.background = "white";

            // Clone the original content
            const originalContent = document.getElementById("printable-area");
            const contentClone = originalContent.cloneNode(true);

            // Force open all accordion items
            const collapses = contentClone.querySelectorAll(".collapse");
            collapses.forEach((collapse) => {
                collapse.querySelector('input[type="radio"]').checked = true;
            });

            // Remove any problematic elements
            const elementsToRemove =
                contentClone.querySelectorAll('[class*="bg-"]');
            elementsToRemove.forEach((el) => {
                el.style.backgroundColor = "";
            });

            printElement.appendChild(contentClone);
            document.body.appendChild(printElement);

            // Generate PDF
            const canvas = await html2canvas(printElement, {
                scale: 2,
                logging: false,
                useCORS: true,
                removeContainer: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`Item Analysis - ${assessment.title}.pdf`);

            // Clean up
            document.body.removeChild(printElement);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-6" id="printable-area">
            <Head title={`Item Analysis - ${assessment.title}`} />

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Item Analysis: {assessment.title}
                </h1>
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Print/Save PDF
                </button>
            </div>

            <div className="mt-4 flex flex-col">
                {questions.map((question, index) => (
                    <div key={index} className="mb-2">
                        <div className="collapse collapse-plus bg-slate-100 text-black">
                            <input
                                type="radio"
                                name="question-accordion"
                                defaultChecked
                            />
                            <div className="collapse-title text-xl font-medium">
                                <div className="flex flex-row justify-between items-center">
                                    <p>{question.question_text}</p>
                                    <div className="rounded-2xl p-2 flex bg-slate-100 flex-row items-center space-x-1">
                                        {getIcon(
                                            question.correct_answers >
                                                question.wrong_answers
                                        )}
                                        <div
                                            className={`rounded-2xl px-2 ${
                                                question.correct_answers >
                                                question.wrong_answers
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            <p className="text-base">
                                                {question.correct_answers}/
                                                {question.correct_answers +
                                                    question.wrong_answers}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="collapse-content">
                                <div className="flex flex-col space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <strong>Item Difficulty:</strong>{" "}
                                        {(
                                            (question.correct_answers /
                                                (question.correct_answers +
                                                    question.wrong_answers)) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </p>

                                    {Object.entries(question.option_count).map(
                                        ([option, count], idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm"
                                            >
                                                <span className="text-black">
                                                    {option}
                                                </span>
                                                <span className="text-gray-700 text-sm">
                                                    {count} students
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssessmentItemAnalysis;
