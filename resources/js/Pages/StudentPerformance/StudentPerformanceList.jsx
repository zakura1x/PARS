import { useState, useMemo } from "react";
import { usePage, router } from "@inertiajs/react";
import {
    ArrowUpDown,
    Award,
    User,
    Mail,
    AlertCircle,
    Eye,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const StudentPerformanceTable = () => {
    const { studentPerformance } = usePage().props;
    const [perPage, setPerPage] = useState(studentPerformance?.per_page || 10);
    const [sortConfig, setSortConfig] = useState({
        key: "average_score",
        direction: "desc",
    });

    // Handle sorting
    const handleSort = (key) => {
        const direction =
            sortConfig.key === key && sortConfig.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ key, direction });

        // Update URL with sort parameters
        router.get(
            route("student.performance"),
            {
                sort: key,
                direction,
                perPage,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Handle pagination navigation
    const handlePageChange = (url) => {
        if (url) {
            router.get(
                url,
                {
                    sort: sortConfig.key,
                    direction: sortConfig.direction,
                    perPage,
                },
                {
                    preserveState: true,
                }
            );
        }
    };

    // Handle per page change
    const handlePerPageChange = (e) => {
        const newPerPage = e.target.value;
        setPerPage(newPerPage);

        router.get(
            route("student.performance"),
            {
                sort: sortConfig.key,
                direction: sortConfig.direction,
                perPage: newPerPage,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Get the data from paginated response or fallback to empty array
    const students = useMemo(() => {
        return studentPerformance?.data || [];
    }, [studentPerformance]);

    // Sort the data
    const sortedData = useMemo(() => {
        const sortableData = [...students];
        sortableData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
        return sortableData;
    }, [students, sortConfig]);

    const getAvatarLetter = (name) =>
        name ? name.charAt(0).toUpperCase() : "?";
    const getAvatarColor = (score) => {
        if (score >= 90)
            return "bg-gradient-to-br from-emerald-400 to-green-600";
        if (score >= 75)
            return "bg-gradient-to-br from-amber-300 to-yellow-500";
        return "bg-gradient-to-br from-rose-400 to-red-500";
    };

    const getPerformanceBadge = (score, index) =>
        index === 0 && score >= 90 ? (
            <div className="badge badge-sm badge-accent gap-1 absolute -top-1 -right-1 animate-pulse">
                <Award className="h-3 w-3" /> Top
            </div>
        ) : null;

    if (students.length === 0) {
        return (
            <div className="overflow-hidden w-full bg-base-100 rounded-xl shadow-md border border-base-300">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Student Performance
                    </h3>
                </div>
                <div className="p-6 flex flex-col items-center justify-center gap-2 opacity-70">
                    <AlertCircle className="h-8 w-8" />
                    <p>No student data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden w-full bg-base-100 rounded-xl shadow-md border border-base-300">
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Student Performance
                </h3>
            </div>

            <div className="p-2">
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex items-center gap-2 text-md">
                        <span>Show</span>
                        <select
                            value={perPage}
                            onChange={handlePerPageChange}
                            className="select select-bordered select-sm w-20 h-10"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span>entries</span>
                    </div>
                    <div className="text-sm opacity-70">
                        Showing {studentPerformance.from} to{" "}
                        {studentPerformance.to} of {studentPerformance.total}{" "}
                        entries
                    </div>
                </div>

                <table className="table table-zebra w-full">
                    <thead>
                        <tr className="text-xs bg-base-200/50">
                            <th
                                className="cursor-pointer rounded-tl-lg hover:bg-base-300 transition-colors"
                                onClick={() => handleSort("name")}
                            >
                                <div className="flex items-center gap-1">
                                    <span>Student</span>
                                    <ArrowUpDown className="h-3 w-3 opacity-70" />
                                </div>
                            </th>
                            <th
                                className="cursor-pointer hover:bg-base-300 transition-colors"
                                onClick={() => handleSort("average_score")}
                            >
                                <div className="flex items-center gap-1 justify-end">
                                    <span>Score</span>
                                    <ArrowUpDown className="h-3 w-3 opacity-70" />
                                </div>
                            </th>
                            <th className="text-right rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((student, index) => (
                            <tr
                                key={student.id}
                                className="hover:bg-base-200/70 transition-colors"
                            >
                                <td className="max-w-[180px]">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`relative avatar placeholder ${
                                                index === 0
                                                    ? "ring ring-primary ring-offset-2 ring-offset-base-100"
                                                    : ""
                                            }`}
                                        >
                                            <div
                                                className={`w-10 rounded-full text-white ${getAvatarColor(
                                                    student.average_score
                                                )}`}
                                            >
                                                <span>
                                                    {getAvatarLetter(
                                                        student.name
                                                    )}
                                                </span>
                                                {getPerformanceBadge(
                                                    student.average_score,
                                                    index
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="font-medium truncate flex items-center gap-1">
                                                <User className="h-3 w-3 opacity-70" />
                                                <span>{student.name}</span>
                                            </div>
                                            <div className="text-xs opacity-70 truncate flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                <span>{student.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="radial-progress text-xs"
                                                style={{
                                                    "--value":
                                                        student.average_score,
                                                    "--size": "2rem",
                                                    "--thickness": "3px",
                                                    color:
                                                        student.average_score >=
                                                        90
                                                            ? "hsl(var(--su))"
                                                            : student.average_score >=
                                                              75
                                                            ? "hsl(var(--wa))"
                                                            : "hsl(var(--er))",
                                                }}
                                            >
                                                <span className="font-bold">
                                                    {student.average_score}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-base-300 rounded-full h-1.5">
                                            <div
                                                className={`h-1.5 rounded-full ${
                                                    student.average_score >= 90
                                                        ? "bg-success"
                                                        : student.average_score >=
                                                          75
                                                        ? "bg-warning"
                                                        : "bg-error"
                                                }`}
                                                style={{
                                                    width: `${student.average_score}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </td>
                                <td className="text-right w-40">
                                    <button
                                        className="btn btn-sm text-white bg-green-900 hover:bg-green-500"
                                        onClick={() =>
                                            router.get(
                                                `/dashboard/student/${student.id}`
                                            )
                                        }
                                    >
                                        <Eye className="h-4 w-4 mr-1" /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between items-center mt-4 px-2">
                    <div className="text-sm opacity-70">
                        Showing {studentPerformance.from} to{" "}
                        {studentPerformance.to} of {studentPerformance.total}{" "}
                        entries
                    </div>
                    <div className="join">
                        <button
                            className="join-item btn btn-sm"
                            onClick={() =>
                                handlePageChange(
                                    studentPerformance.prev_page_url
                                )
                            }
                            disabled={!studentPerformance.prev_page_url}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="join-item btn btn-sm">
                            Page {studentPerformance.current_page} of{" "}
                            {studentPerformance.last_page}
                        </button>
                        <button
                            className="join-item btn btn-sm"
                            onClick={() =>
                                handlePageChange(
                                    studentPerformance.next_page_url
                                )
                            }
                            disabled={!studentPerformance.next_page_url}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPerformanceTable;
