import { TbCloudQuestion } from "react-icons/tb";

const menuItems = [
    {
        section: "Question",
        details: [
            {
                title: "Question",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Add Question", href: "/questionDetails", key: 1 },
                    { label: "Question List", href: "/questionBank", key: 2 },
                    { label: "Approve Question", href: "", key: 3 },
                    { label: "Mass Upload Question", href: "", key: 4 },
                ],
            },
            {
                title: "Assessment",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Generate Assessment", href: "", key: 5 },
                    { label: "View Assessments", href: "", key: 6 },
                    { label: "Assessment Dashboard", href: "", key: 7 },
                    //{ label: "Assessment Repository", href: "", key: 4 },
                ],
            },
        ],
    },
    {
        section: "User Management",
        details: [
            {
                title: "User",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "User List", href: "/UserList", key: 8 },
                    { label: "Faculty Assignment", href: "", key: 9 },
                ],
            },
        ],
    },
    {
        section: "Class",
        details: [
            {
                title: "Subject Manage",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Subject List", href: "/subjectList", key: 10 },
                ],
            },
            {
                title: "Topic Manage",
                icon: <TbCloudQuestion size={26} />,
                items: [{ label: "Topic List", href: "/topicList", key: 11 }],
            },
        ],
    },
];

export default menuItems;
