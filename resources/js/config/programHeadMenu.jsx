import { TbCloudQuestion } from "react-icons/tb";
import { LuFileQuestion } from "react-icons/lu";
import { MdOutlineAssessment } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaUserGraduate } from "react-icons/fa";
import { IoBook } from "react-icons/io5";
import { IoIosBookmarks } from "react-icons/io";

const programHeadMenu = [
    {
        section: "Question",
        details: [
            {
                title: "Question",
                icon: <LuFileQuestion size={26} />,
                items: [
                    { label: "Add Question", href: "/questionDetails", key: 1 },
                    { label: "Question List", href: "/questionBank", key: 2 },
                    { label: "Approve Question", href: "", key: 3 },
                    {
                        label: "Mass Upload Question",
                        href: "/question/mass-upload",
                        key: 4,
                    },
                ],
            },
            {
                title: "Assessment",
                icon: <MdOutlineAssessment size={26} />,
                items: [
                    { label: "Generate Exam Assessment", href: "/assessment/generator/form/exam", key: 5 },
                    { label: "View Assessments", href: "/assessment/index/program-head", key: 6 },
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
                icon: <FaUsers size={26} />,
                items: [
                    { label: "User List", href: "/UserList", key: 8 },
                    { label: "Faculty Assignment", href: "", key: 9 },
                ],
            },
            {
                title: "Student",
                icon: <FaUserGraduate size={26} />,
                items: [
                    { label: "Student List", href: "/student/list", key: 10 },
                    { label: "Mass Upload Student", href: "", key: 11 },
                ],
            },
        ],
    },
    {
        section: "Class",
        details: [
            {
                title: "Subject Manage",
                icon: <IoBook size={26} />,
                items: [
                    { label: "Subject List", href: "/subjectList", key: 10 },
                ],
            },
            {
                title: "Topic Manage",
                icon: <IoIosBookmarks size={26} />,
                items: [
                    { label: "Topic List", href: "/topic/lists", key: 11 },
                    {
                        label: "Topic Grading Criteria",
                        href: "/topic-grading-criteria/index",
                        key: 12,
                    },
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
