import React, { useEffect, useState } from "react";
import { router } from "@inertiajs/react";

const AssessmentWaitingProf = ({ assessment, initialWaitingStudents, assessmentCode }) => {
  const [waitingStudents, setWaitingStudents] = useState(initialWaitingStudents);

  useEffect(() => {
    // Listen for the "student.joined" event
    window.Echo.channel(`assessment.${assessment.id}`)
      .listen(".student.joined", (event) => {
        setWaitingStudents((prev) => [...prev, event.student]);
      });

    return () => {
      window.Echo.leaveChannel(`assessment.${assessment.id}`);
    };
  }, [assessment.id]);

    // Function to handle starting the assessment
    const startAssessment = (assessmentId) => {
        router.post(`/api/professor/assessment/${assessmentId}/start`, {}, {
        onSuccess: () => {
            window.location.reload(); // Reload the page to reflect changes
        },
        onError: (errors) => {
            console.error("Failed to start the assessment", errors);
        }
        });
    };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{assessment.name}</h1>
      <p className="text-gray-700 mb-2">Status: {assessment.status}</p>
      <p className="text-gray-700 mb-4">Access Code: <span className="font-mono text-blue-600">{assessmentCode}</span></p>
      
      <h2 className="text-xl font-semibold mb-3">Waiting Students</h2>
      {waitingStudents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {waitingStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No students are currently waiting.</p>
      )}

      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => startAssessment(assessment.id)}
          className="btn btn-primary"
        >
          Start Assessment
        </button>
        <button className="btn btn-secondary">Cancel</button>
      </div>
    </div>
  );
};

export default AssessmentWaitingProf;


