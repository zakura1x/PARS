import React, { useState } from "react";
import { usePage, useForm, router, Head } from "@inertiajs/react";
import Header from "../../components/UserManagement/Header";
import UserTable from "../../components/UserManagement/UserTable";
import AddUserModal from "../../components/UserManagement/AddUserModal";
import FlashMessage from "../../components/Notifications/FlashMessage";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { flash, users } = usePage().props;

    //Initialize data for form
    const { data, setData, post, reset, errors, processing } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        idNumber: "",
        role: "",
        birthdate: "",
        gender: "",
    });

    const handleSearchChange = (e) => {
        if (!e || !e.target) {
            console.error("Event or event target is undefined", e);
            return;
        }
        setSearchQuery(e.target.value);

        router.get(
            "/UserList",
            { search: searchQuery },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (url) => {
        router.get(url, { search: searchQuery }, { preserveScroll: true });
    };

    //Save The User
    const handleSaveChanges = (e) => {
        e.preventDefault();

        const url = data.id ? `/users/edit/${data.id}` : `/register`;

        // Prepare the data to send
        const formData = {
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            idNumber: data.idNumber,
            role: data.role,
            gender: data.gender,
            birthdate: data.birthdate,
        };

        // Use put for editing, post for creating
        if (data.id) {
            router.put(url, formData, {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        } else {
            router.post(url, formData, {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                },
                onError: (errors) => {
                    console.log(errors);
                },
            });
        }
    };

    //Reset the form
    const handleCancel = () => {
        reset();
        setShowModal(false);
    };

    //Edit the User - Fixed to properly get gender and birthdate from user's role model

    const handleEditUser = (user) => {
        // Determine which role data to use
        const roleData =
            user.role === "professor"
                ? user.professor
                : user.role === "program_head"
                ? user.program_head
                : user.role === "dean"
                ? user.dean
                : null;

        setData({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            idNumber: user.idNumber,
            role: user.role,
            gender: roleData?.gender || "",
            birthdate: roleData?.birth_date
                ? formatDateForInput(roleData.birth_date)
                : "",
        });
        setShowModal(true);
    };

    // Helper function to format date for input[type="date"]
    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Head title="User" />
            {<FlashMessage message={flash.message} />}
            <Header
                searchQuery={searchQuery}
                setSearchQuery={handleSearchChange}
                setShowModal={setShowModal}
            />
            <UserTable
                users={users}
                onPageChange={handlePageChange}
                onEditUser={handleEditUser}
                setShowModal={setShowModal}
                setData={setData}
                searchQuery={handleSearchChange}
            />
            <AddUserModal
                showModal={showModal}
                handleSaveChanges={handleSaveChanges}
                handleCancel={handleCancel}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
            />
        </div>
    );
};

export default UserManagement;
