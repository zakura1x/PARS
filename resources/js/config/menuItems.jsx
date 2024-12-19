import { TbCloudQuestion } from "react-icons/tb";

const menuItems = [
    {
        section: "Dashboard",
        details: [
            {
                title: "Question",
                icon: <TbCloudQuestion size={26} />,
                items: [
                    { label: "Add Question", href: "", key: 1 },
                    { label: "Question List", href: "", key: 2 },
                    { label: "Approve Question", href: "", key: 3 },
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
                    { label: "User List", href: "/UserList", key: 4 },
                    { label: "Faculty Assignment", href: "", key: 5 },
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
                    { label: "Subject List", href: "/subjectList", key: 6 },
                ],
            },
            {
                title: "Topic Manage",
                icon: <TbCloudQuestion size={26} />,
                items: [{ label: "Topic List", href: "", key: 7 }],
            },
        ],
    },
];

export default menuItems;
