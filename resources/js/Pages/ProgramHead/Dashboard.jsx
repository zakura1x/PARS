import { usePage, Head } from "@inertiajs/react";

const Dashboard = () => {
    const { auth } = usePage().props; // Access props here

    return (
        <div>
            {/* <Head title="Dashboard" />
            <h1>Welcome, {auth.user.name}</h1>
            Your dashboard content */}
        </div>
    );
};

export default Dashboard;
