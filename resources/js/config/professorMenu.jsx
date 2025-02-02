import { TbCloudQuestion } from "react-icons/tb";

const professorMenu = [
    {
        section: "Question Bank",
        details: [
            {
                title: "Question",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Question Bank", href: "/questionBank", key: 1 },
                    { label: "Add Question", href: "/questionDetails", key: 2 },
                    { label: "Mass Upload Question", href: "#", key: 3 },
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
                    { label: "Generate Assessment", href: "#", key: 4 },
                    { label: "Assessments Table", href: "#", key: 5 },
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
                    { label: "Mass Upload Student", href: "#", key: 5 },
                    { label: "Student Proficiencies", href: "#", key: 5 },
                ],
            },
        ],
    },
    {
        section: "Class",
        details: [
            {
                title: "Manage Subjects",
                icon: <TbCloudQuestion size={26} />,
                items: [{ label: "Subjects", href: "#", key: 4 }],
            },
            {
                title: "Manage Topics",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Topic List", href: "#", key: 4 },
                    {
                        label: "Table of Specification (TOS)",
                        href: "#",
                        key: 4,
                    },
                ],
            },
        ],
    },
];

export default professorMenu;
