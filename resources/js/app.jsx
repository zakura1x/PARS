import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import Layout from "@/Layouts/Layout";
import AuthLayout from "./Layouts/AuthLayout";

const getUserRole = () => {
    return null;
};

createInertiaApp({
    title: (title) => (title ? `${title} - PARS` : "PARS"),

    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];

        const isAuthPage = name.startsWith("Authentication/");

        const userRole = getUserRole();

        page.default.layout =
            page.default.layout ||
            ((page) => {
                if (isAuthPage) {
                    return <AuthLayout>{page}</AuthLayout>;
                } else {
                    const LayoutComponent = Layout; // Change this if you have more role-based layouts
                    return <LayoutComponent>{page}</LayoutComponent>;
                }
            });
        return page;
    },

    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },

    progress: {
        color: "#fff",
        showSpinner: true,
    },
});
