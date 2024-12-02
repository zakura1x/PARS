import "./bootstrap";
import "../css/app.css";

import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import Layout from "@/Layouts/Layout";
import AuthLayout from "@/Layouts/AuthLayout";

createInertiaApp({
    title: (title) => (title ? `${title} - PARS` : "PARS"),
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        let page = pages[`./Pages/${name}.jsx`];

        // Check if page is undefined
        if (!page) {
            console.error(`Page not found: ${name}`);
            return; // You can choose to return a fallback or handle the error as needed
        }

        const isAuthPage = name.startsWith("Authentication/");

        // Assign the layout, using a default layout for now
        const LayoutComponent = isAuthPage ? AuthLayout : Layout;

        page.default.layout =
            page.default.layout ||
            ((page) => <LayoutComponent>{page}</LayoutComponent>);

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: "#42604C",
        showSpinner: false,
    },
});
