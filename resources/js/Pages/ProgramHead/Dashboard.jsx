import { usePage, Head } from "@inertiajs/react";

const Dashboard = () => {
    const { auth } = usePage().props; // Access props here

    return (
        <>
            <Head title="Dashboard" />

            <div>title</div>
        </>
    );
};

export default Dashboard;
