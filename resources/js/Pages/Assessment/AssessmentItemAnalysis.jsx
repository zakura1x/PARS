import React from "react";
import { Head, usePage } from "@inertiajs/react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFDownloadLink,
} from "@react-pdf/renderer";

// Create styles for the PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 12,
        lineHeight: 1.5,
    },
    header: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: "bold",
    },
    section: {
        marginBottom: 30,
    },
    questionContainer: {
        marginBottom: 15,
        border: "1px solid #e2e8f0",
        borderRadius: 4,
        padding: 10,
    },
    questionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    questionText: {
        fontWeight: "bold",
        fontSize: 14,
    },
    statsContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    correctAnswer: {
        color: "green",
        fontWeight: "bold",
    },
    wrongAnswer: {
        color: "red",
        fontWeight: "bold",
    },
    scoreBox: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    correctScore: {
        backgroundColor: "#bbf7d0",
    },
    wrongScore: {
        backgroundColor: "#fecaca",
    },
    difficultyText: {
        fontSize: 10,
        color: "#64748b",
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        padding: 8,
        borderRadius: 4,
        marginBottom: 4,
        border: "1px solid #f1f5f9",
    },
    optionText: {
        fontSize: 10,
    },
});

// PDF Document Component
const AnalysisPDF = ({ assessment, questions }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>
                    Item Analysis: {assessment.title}
                </Text>

                {questions.map((question, index) => {
                    const isCorrectMajority =
                        question.correct_answers > question.wrong_answers;
                    const totalAnswers =
                        question.correct_answers + question.wrong_answers;
                    const difficulty = (
                        (question.correct_answers / totalAnswers) *
                        100
                    ).toFixed(2);

                    return (
                        <View
                            key={index}
                            style={styles.questionContainer}
                            wrap={false}
                        >
                            <View style={styles.questionHeader}>
                                <Text style={styles.questionText}>
                                    Q{index + 1}: {question.question_text}
                                </Text>
                                <View style={styles.statsContainer}>
                                    <Text
                                        style={
                                            isCorrectMajority
                                                ? styles.correctAnswer
                                                : styles.wrongAnswer
                                        }
                                    >
                                        {isCorrectMajority ? "✔" : "✖"}
                                    </Text>
                                    <View
                                        style={[
                                            styles.scoreBox,
                                            isCorrectMajority
                                                ? styles.correctScore
                                                : styles.wrongScore,
                                        ]}
                                    >
                                        <Text>
                                            {question.correct_answers}/
                                            {totalAnswers}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={styles.difficultyText}>
                                <Text style={{ fontWeight: "bold" }}>
                                    Item Difficulty:{" "}
                                </Text>
                                {difficulty}%
                            </Text>

                            {Object.entries(question.option_count).map(
                                ([option, count], idx) => (
                                    <View key={idx} style={styles.optionRow}>
                                        <Text style={styles.optionText}>
                                            {option}
                                        </Text>
                                        <Text style={styles.optionText}>
                                            {count} students
                                        </Text>
                                    </View>
                                )
                            )}
                        </View>
                    );
                })}
            </View>
        </Page>
    </Document>
);

const AssessmentItemAnalysis = () => {
    const { assessment, questions } = usePage().props;

    return (
        <div className="container mx-auto p-6">
            <Head title={`Item Analysis - ${assessment.title}`} />

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Item Analysis: {assessment.title}
                </h1>
                <PDFDownloadLink
                    document={
                        <AnalysisPDF
                            assessment={assessment}
                            questions={questions}
                        />
                    }
                    fileName={`Item Analysis - ${assessment.title}.pdf`}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {({ loading }) =>
                        loading ? "Generating PDF..." : "Download PDF"
                    }
                </PDFDownloadLink>
            </div>

            {/* Original HTML view remains unchanged */}
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
                                        <span
                                            className={`text-lg font-bold ${
                                                question.correct_answers >
                                                question.wrong_answers
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {question.correct_answers >
                                            question.wrong_answers
                                                ? "✔"
                                                : "✖"}
                                        </span>
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
