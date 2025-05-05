import React from 'react';
import { FileText } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import AnalysisPDF from "../../misc/AnalysisPDF";

export default function ExamAssessmentTracker({ assessments }) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center mb-4">
          <FileText className="mr-2" size={20} />
          <h2 className="card-title">EXAM ASSESSMENT TRACKER</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Ave. Score</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => {

                return (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.averageScore} %</td>
                    <td className="flex items-center gap-2">
                      <span>{a.submissions}</span>
                      {a.questions && a.questions.length > 0 ? (
                        <PDFDownloadLink
                          document={
                            <AnalysisPDF
                              assessment={{ title: a.name }}
                              questions={a.questions}
                            />
                          }
                          fileName={`Item Analysis - ${a.name}.pdf`}
                          className="text-green-600 hover:text-green-800"
                        >
                          {({ loading }) =>
                            loading ? (
                              <span className="text-sm">Loading...</span>
                            ) : (
                              <FileText
                                size={19}
                                className="cursor-pointer"
                                title="Download Item Analysis"
                              />
                            )
                          }
                        </PDFDownloadLink>
                      ) : (
                        <span className="text-gray-400 italic text-xs">
                          No data available
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
