import {
    LayoutDashboard,
    FileQuestion,
    ClipboardList,
    Users,
    GraduationCap,
    BookOpen,
    Bookmark,
} from "lucide-react";

const programHeadMenu = [
    {
        section: "Dashboard",
        details: [
            {
                title: "Dashboard",
                icon: <LayoutDashboard size={26} />,
                items: [
                    { label: "Dashboard", href: "/dashboard", key: 13 },
                ],
            },
        ],
    },
    {
        section: "Question",
        details: [
            {
                title: "Question",
                icon: <FileQuestion size={26} />,
                items: [
                    { label: "Add Question", href: "/questionDetails", key: 1 },
                    { label: "Question List", href: "/questionBank", key: 2 },
                    {
                        label: "Mass Upload Question",
                        href: "/question/mass-upload",
                        key: 4,
                    },
                ],
            },
            {
                title: "Assessment",
                icon: <ClipboardList size={26} />,
                items: [
                    {
                        label: "Generate Exam Assessment",
                        href: "/assessment/generator/form/exam",
                        key: 5,
                    },
                    {
                        label: "View Assessments",
                        href: "/assessment/index/program-head",
                        key: 6,
                    },
                    { label: "Assessment Dashboard", href: "", key: 7 },
                ],
            },
        ],
    },
    {
        section: "User Management",
        details: [
            {
                title: "User",
                icon: <Users size={26} />,
                items: [
                    { label: "User List", href: "/UserList", key: 8 },
                    { label: "Faculty Assignment", href: "", key: 9 },
                ],
            },
            {
                title: "Student",
                icon: <GraduationCap size={26} />,
                items: [
                    { label: "Student List", href: "/student/list", key: 10 },
                    {
                        label: "Mass Upload Student",
                        href: "/student/mass/upload/form",
                        key: 11,
                    },
                ],
            },
        ],
    },
    {
        section: "Class",
        details: [
            {
                title: "Subject Manage",
                icon: <BookOpen size={26} />,
                items: [
                    { label: "Subject List", href: "/subjectList", key: 10 },
                ],
            },
            {
                title: "Topic Manage",
                icon: <Bookmark size={26} />,
                items: [
                    { label: "Topic List", href: "/topic/lists", key: 11 },
                    {
                        label: "Table of Specification (TOS)",
                        href: "/table-of-specification/index",
                        key: 13,
                    },
                ],
            },
        ],
    },
];

export default programHeadMenu;
