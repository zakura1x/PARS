import {
    LayoutDashboard,
    FileQuestion,
    ClipboardList,
    Users,
    BookOpen,
    Bookmark,
    FileInput,
    FileUp,
    FileText,
    ListChecks,
    UserCog,
    UploadCloud,
    BookmarkCheck,
    ListTodo,
} from "lucide-react";

const professorMenu = [
    {
        section: "Dashboard",
        details: [
            {
                title: "Dashboard",
                icon: <LayoutDashboard size={26} />,
                items: [
                    {
                        label: "Dashboard",
                        href: "/dashboard/prof",
                        key: 1,
                    },
                ],
            },
        ],
    },
    {
        section: "Question Bank",
        details: [
            {
                title: "Question",
                icon: <FileQuestion size={26} />,
                items: [
                    {
                        label: "Question Bank",
                        href: "/questionBank",
                        key: 2,
                        icon: <Bookmark size={20} />,
                    },
                    {
                        label: "Add Question",
                        href: "/questionDetails",
                        key: 3,
                        icon: <FileInput size={20} />,
                    },
                    {
                        label: "Mass Upload Question",
                        href: "/question/mass-upload",
                        key: 4,
                        icon: <UploadCloud size={20} />,
                    },
                ],
            },
        ],
    },
    {
        section: "Assessment",
        details: [
            {
                title: "Assessment",
                icon: <ClipboardList size={26} />,
                items: [
                    {
                        label: "Generate Exam Assessment",
                        href: "/assessment/generator/form/exam",
                        key: 5,
                        icon: <FileText size={20} />,
                    },
                    {
                        label: "Assessments Table",
                        href: "/assessment/index/program-head",
                        key: 6,
                        icon: <ListChecks size={20} />,
                    },
                    {
                        label: "Ongoing Assessments",
                        href: "#",
                        key: 7,
                        icon: <ListTodo size={20} />,
                    },
                ],
            },
        ],
    },
    {
        section: "Student",
        details: [
            {
                title: "Student",
                icon: <Users size={26} />,
                items: [
                    {
                        label: "Student List",
                        href: "/student/list",
                        key: 8,
                        icon: <Users size={20} />,
                    },
                    {
                        label: "Mass Upload Student",
                        href: "/student/mass/upload/form",
                        key: 9,
                        icon: <UploadCloud size={20} />,
                    },
                    {
                        label: "Student Proficiencies",
                        href: "#",
                        key: 10,
                        icon: <UserCog size={20} />,
                    },
                ],
            },
        ],
    },
    {
        section: "Class",
        details: [
            {
                title: "Manage Topics",
                icon: <BookOpen size={26} />,
                items: [
                    {
                        label: "Topic List",
                        href: "/topic/lists",
                        key: 11,
                        icon: <BookmarkCheck size={20} />,
                    },
                    {
                        label: "Table of Specification (TOS)",
                        href: "/table-of-specification/index",
                        key: 12,
                        icon: <ListChecks size={20} />,
                    },
                ],
            },
        ],
    },
];

export default professorMenu;
