import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
    page: { padding: 30, fontSize: 12, lineHeight: 1.5 },
    header: { fontSize: 18, marginBottom: 20, fontWeight: "bold" },
    section: { marginBottom: 30 },
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
    questionText: { fontWeight: "bold", fontSize: 14 },
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
    optionText: { fontSize: 10 },
});

const AnalysisPDF = ({ assessment, questions }) => (
    <Document>
        <Page style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Item Analysis: {assessment.title}</Text>

                {questions.map((question, index) => {
                    const totalAnswers =
                        question.correct_answers + question.wrong_answers;
                    const difficulty = totalAnswers
                        ? ((question.correct_answers / totalAnswers) * 100).toFixed(2)
                        : "0.00";

                    return (
                        <View key={index} style={styles.questionContainer} wrap={false}>
                            <View style={styles.questionHeader}>
                                <Text style={styles.questionText}>
                                    Q{index + 1}: {question.question_text}
                                </Text>
                            </View>

                            <Text style={styles.difficultyText}>
                                <Text style={{ fontWeight: "bold" }}>Item Difficulty: </Text>
                                {difficulty}%
                            </Text>

                            {Object.entries(question.option_count).map(([option, count], idx) => (
                                <View key={idx} style={styles.optionRow}>
                                    <Text style={styles.optionText}>{option}</Text>
                                    <Text style={styles.optionText}>{count} students</Text>
                                </View>
                            ))}
                        </View>
                    );
                })}
            </View>
        </Page>
    </Document>
);

export default AnalysisPDF;
