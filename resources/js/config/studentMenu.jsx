import { TbCloudQuestion } from "react-icons/tb";

const studentMenu = [
    {
        section: "Dashboard",
        details: [
            {
                title: "Dashboard",
                icon: <TbCloudQuestion size={26} />,
                items: [{ label: "Dashboard", href: "/dashboard", key: 5 }],
            },
        ],
    },
    {
        section: "Assessments",
        details: [
            {
                title: "My Assessments",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    {
                        label: "Available Tests",
                        href: "/student/tests",
                        key: 1,
                    },
                    { label: "Past Results", href: "/student/results", key: 2 },
                ],
            },
            {
                title: "Practice Assessments",
                icon: <TbCloudQuestion size={26} />,
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
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "My Profile", href: "/student/profile", key: 3 },
                    { label: "Settings", href: "/student/settings", key: 4 },
                ],
            },
        ],
    },
];

export default studentMenu;
