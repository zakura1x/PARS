import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import Header from "../../components/UserManagement/Header";
import UserTable from "../../components/UserManagement/UserTable";
import AddUserModal from "../../components/UserManagement/AddUserModal";
import FlashMessage from "../../components/Notifications/FlashMessage";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { flash, users } = usePage().props;

    const { data, setData, post, reset, errors, processing } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        idNumber: "",
        profilePhoto: "",
        role: "",
        birthdate: "",
        gender: "",
    });

    const filteredUsers = users.data.filter(
        (user) =>
            user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (url) => {
        window.location.href = url; // Trigger page change using the URL from pagination
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        //console.log(data);
        post("/register", {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
            onError: () => {
                console.log(errors);
            },
        });
    };

    const handleCancel = () => {
        reset();
        setShowModal(false);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {<FlashMessage message={flash.message} />}
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowModal={setShowModal}
            />
            <UserTable users={users} onPageChange={handlePageChange} />
            <AddUserModal
                showModal={showModal}
                setShowModal={setShowModal}
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
