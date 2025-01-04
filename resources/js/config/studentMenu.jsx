import { TbCloudQuestion } from "react-icons/tb";

const studentMenu = [
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
