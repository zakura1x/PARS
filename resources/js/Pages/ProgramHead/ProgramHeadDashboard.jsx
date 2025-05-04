"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { FileText, Users } from 'lucide-react'

export default function ProgramHeadDashboard() {
  const [selectedSubject, setSelectedSubject] = useState("Taxation")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data - replace with actual data from your backend
  const stats = {
    pendingApprovals: 6,
    studentsReadyForExam: 15,
    enrolledStudents: 20,
    studentsNeedIntervention: 19,
    activeProfessors: 8,
    programHeads: 2,
    deans: 1,
  }

  const proficiencyData = [
    { topic: "Topic 1", beginner: 50, intermediate: 75, advanced: 95 },
    { topic: "Topic 2", beginner: 45, intermediate: 80, advanced: 90 },
    { topic: "Topic 3", beginner: 55, intermediate: 70, advanced: 100 },
    { topic: "Topic 4", beginner: 60, intermediate: 85, advanced: 95 },
    { topic: "Topic 5", beginner: 40, intermediate: 75, advanced: 90 },
    { topic: "Topic 6", beginner: 50, intermediate: 80, advanced: 100 },
    { topic: "Topic 7", beginner: 55, intermediate: 75, advanced: 95 },
    { topic: "Topic 8", beginner: 45, intermediate: 80, advanced: 100 },
    { topic: "Topic 9", beginner: 50, intermediate: 75, advanced: 95 },
  ]

  const studentPerformance = [
    { id: 1, name: "Student1", number: "09-12342", averageScore: 88.21, status: "good" },
    { id: 2, name: "Student2", number: "08-46775", averageScore: 85.45, status: "good" },
    { id: 3, name: "Student3", number: "07-74568", averageScore: 83.21, status: "good" },
    { id: 4, name: "Student4", number: "10-84567", averageScore: 72.34, status: "poor" },
  ]

  const examAssessments = [
    { id: 1, name: "PRETEST ON TAXATION", averageScore: 93.21, submissions: 20 },
    { id: 2, name: "PRETEST ON TAXATION", averageScore: 85.45, submissions: 8 },
    { id: 3, name: "PRETEST ON TAXATION", averageScore: 79.21, submissions: 25 },
  ]

  const subjects = ["Taxation", "Accounting", "Economics", "Finance", "Management"]

  return (
    <div className="min-h-screen bg-base-100">
      <div className="p-4 md:p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <select
              className="select select-bordered"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tabs tabs-boxed">
          <a className={`tab ${activeTab === "overview" ? "tab-active" : ""}`} onClick={() => setActiveTab("overview")}>
            Overview
          </a>
          <a
            className={`tab ${activeTab === "students" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </a>
          <a
            className={`tab ${activeTab === "assessments" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("assessments")}
          >
            Assessments
          </a>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <h2 className="text-sm font-bold opacity-70">ASSESSMENT'S APPROVAL</h2>
                  <div className="text-6xl font-bold text-red-500">{stats.pendingApprovals}</div>
                  <div className="text-red-500">PENDING</div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <div className="text-6xl font-bold text-green-500">{stats.studentsReadyForExam}</div>
                  <div className="text-xs font-bold">STUDENTS READY FOR EXAM</div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <div className="text-6xl font-bold text-yellow-500">{stats.enrolledStudents}</div>
                  <div className="text-xs font-bold">ENROLLED STUDENTS</div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <div className="text-6xl font-bold text-purple-500">{stats.studentsNeedIntervention}</div>
                  <div className="text-xs font-bold">STUDENTS NEED INTERVENTION</div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <div className="text-6xl font-bold text-red-700">{stats.activeProfessors}</div>
                  <div className="text-xs font-bold">ACTIVE PROFESSORS</div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <div className="text-6xl font-bold text-purple-600">{stats.programHeads}</div>
                  <div className="text-xs font-bold">PROGRAM HEAD/S</div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-xl">
                <div className="card-body p-4 text-center">
                  <div className="text-6xl font-bold text-blue-500">{stats.deans}</div>
                  <div className="text-xs font-bold">DEAN</div>
                </div>
              </div>
            </div>

            {/* Proficiency Overview */}
            <div className="card bg-base-200 shadow-xl mb-6">
              <div className="card-body">
                <h2 className="card-title">STUDENT'S PROFICIENCY OVERVIEW</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={proficiencyData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="topic" type="category" width={70} />
                      <Tooltip />
                      <Bar dataKey="beginner" stackId="a" fill="#8B0000" name="Beginner" />
                      <Bar dataKey="intermediate" stackId="a" fill="#FFA500" name="Intermediate" />
                      <Bar dataKey="advanced" stackId="a" fill="#FF0000" name="Advanced" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Performance */}
              <div className="card bg-base-200 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center mb-4">
                    <Users className="mr-2" size={20} />
                    <h2 className="card-title">STUDENT PERFORMANCE</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Student Name</th>
                          <th>Student Number</th>
                          <th>Ave. Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentPerformance.map((student) => (
                          <tr key={student.id}>
                            <td className="flex items-center">
                              {student.name}
                              {student.status === "good" ? (
                                <div className="w-3 h-3 rounded-full bg-green-500 ml-2"></div>
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div>
                              )}
                            </td>
                            <td>{student.number}</td>
                            <td>{student.averageScore} %</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Exam Assessment Tracker */}
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
                          <th>Submissions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examAssessments.map((exam) => (
                          <tr key={exam.id}>
                            <td>{exam.name}</td>
                            <td>{exam.averageScore} %</td>
                            <td className="flex items-center">
                              {exam.submissions}
                              <div className="ml-2">
                                <FileText size={16} className="text-green-600" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "students" && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Student List</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Student Number</th>
                      <th>Ave. Score</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentPerformance.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.number}</td>
                        <td>{student.averageScore} %</td>
                        <td>
                          <span
                            className={`badge ${student.status === "good" ? "badge-success" : "badge-error"}`}
                          >
                            {student.status === "good" ? "Good Standing" : "Needs Intervention"}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-xs btn-primary">View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Assessment Approvals</h2>
              <div className="alert alert-warning mb-4">
                <div>
                  <span className="font-bold">You have {stats.pendingApprovals} pending assessment approvals</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Assessment Name</th>
                      <th>Subject</th>
                      <th>Submitted By</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Final Exam - Taxation</td>
                      <td>Taxation</td>
                      <td>Prof. Smith</td>
                      <td>2023-05-15</td>
                      <td className="flex gap-2">
                        <button className="btn btn-xs btn-success">Approve</button>
                        <button className="btn btn-xs btn-error">Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Midterm - Accounting</td>
                      <td>Accounting</td>
                      <td>Prof. Johnson</td>
                      <td>2023-05-14</td>
                      <td className="flex gap-2">
                        <button className="btn btn-xs btn-success">Approve</button>
                        <button className="btn btn-xs btn-error">Reject</button>
                      </td>
                    </tr>
                    <tr>
                      <td>Quiz 3 - Economics</td>
                      <td>Economics</td>
                      <td>Prof. Williams</td>
                      <td>2023-05-13</td>
                      <td className="flex gap-2">
                        <button className="btn btn-xs btn-success">Approve</button>
                        <button className="btn btn-xs btn-error">Reject</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

