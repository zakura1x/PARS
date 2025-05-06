import { TbCloudQuestion } from "react-icons/tb";

const professorMenu = [
    {
        section: "Dashboard",
        details: [
            {
                title: "Dashboard",
                icon: <LayoutDashboard size={26} />,
                items: [{ label: "Dashboard", href: "/dashboard/professor", key: 13 }],
            },
        ],
    },
    {
        section: "Question Bank",
        details: [
            {
                title: "Question",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Question Bank", href: "/questionBank", key: 1 },
                    { label: "Add Question", href: "/questionDetails", key: 2 },
                    {
                        label: "Mass Upload Question",
                        href: "/question/mass-upload",
                        key: 3,
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
                icon: <TbCloudQuestion size={26} />,
                items: [
                    {
                        label: "Generate Exam Assessment",
                        href: "/assessment/generator/form/exam",
                        key: 4,
                    },
                    {
                        label: "Assessments Table",
                        href: "/assessment/index/program-head",
                        key: 5,
                    },
                    { label: "Ongoing Assessments", href: "#", key: 5 },
                ],
            },
        ],
    },
    {
        section: "Student",
        details: [
            {
                title: "Student",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Student List", href: "/student/list", key: 4 },
                    {
                        label: "Mass Upload Student",
                        href: "/student/mass/upload/form",
                        key: 5,
                    },
                    { label: "Student Proficiencies", href: "#", key: 5 },
                ],
            },
        ],
    },
    {
        section: "Class",
        details: [
            {
                title: "Manage Topics",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Topic List", href: "/topic/lists", key: 4 },
                    {
                        label: "Table of Specification (TOS)",
                        href: "/table-of-specification/index",
                        key: 4,
                    },
                ],
            },
        ],
    },
];

export default professorMenu;
