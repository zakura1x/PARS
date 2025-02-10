import {
    LayoutDashboard,
    BookOpen,
    ClipboardList,
    User,
    Folder,
} from "lucide-react";

const studentMenu = [
    {
        section: "Dashboard",
        details: [
            {
                title: "Dashboard",
                icon: <LayoutDashboard size={26} />,
                items: [
                    { label: "Dashboard", href: "/dashboard/student", key: 5 },
                ],
            },
        ],
    },
    {
        section: "Assessments",
        details: [
            {
                title: "My Assessments",
                icon: <ClipboardList size={26} />,
                items: [
                    {
                        label: "Coded Assessment",
                        href: "/assessment/input/code",
                        key: 1,
                    },
                    { label: "Past Results", href: "/student/results", key: 2 },
                ],
            },
            {
                title: "Practice Assessments",
                icon: <BookOpen size={26} />,
                items: [
                    {
                        label: "All Practice Assessments",
                        href: "/student-practice-assessments/index",
                        key: 2,
                    },
                    {
                        label: "Generate Assessment",
                        href: "/student-practice-assessments/generator/form",
                        key: 3,
                    },
                ],
            },
        ],
    },
    {
        section: "Profile",
        details: [
            {
                title: "Account",
                icon: <User size={26} />,
                items: [
                    { label: "My Profile", href: "/student/profile", key: 3 },
                    { label: "Settings", href: "/student/settings", key: 4 },
                ],
            },
        ],
    },
    {
        section: "Study Materials",
        details: [
            {
                title: "Materials",
                icon: <Folder size={26} />,
                items: [
                    {
                        label: "Subjects",
                        href: "/study-materials/index",
                        key: 5,
                    },
                ],
            },
        ],
    },
];

export default studentMenu;
