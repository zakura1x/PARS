import React from "react";
import { usePage } from "@inertiajs/react";
import ProgramHeadLayout from "@/Layouts/ProgramHeadLayout";
import DefaultLayout from "@/Layouts/Layout";

const Layout = ({ children }) => {
    const { auth } = usePage().props;

    if (!auth || !auth.user) {
        return <DefaultLayout>{children}</DefaultLayout>; // If no auth, fall back to default layout
    }

    // Determine the role-based layout
    const roleBasedLayouts = {
        program_head: ProgramHeadLayout,
        // Add other roles here...
    };

    const UserLayout = roleBasedLayouts[auth.user.role] || DefaultLayout;

    return <UserLayout>{children}</UserLayout>;
};

export default Layout;
