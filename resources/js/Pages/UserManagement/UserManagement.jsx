import React, { useState } from "react";
import { usePage, useForm, router } from "@inertiajs/react";
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
        //profilePhoto: "",
        role: "",
        birthdate: "",
        gender: "",
    });

    //Search Filters
    // const filteredUsers = users.data.filter(
    //     (user) =>
    //         user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);

        //Update the user list page
        router.get(
            router("users.index"),
            { search: e.target.value },
            { preserveScroll: true }
        );
    };
    const handlePageChange = (url) => {
        router.get(url, { search: searchQuery }, { preserveScroll: true });
    };

    //Save The User
    const handleSaveChanges = (e) => {
        e.preventDefault();

        const url = data.id ? `/users/edit/${data.id}` : `/register`;

        //post
        post(url, {
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };

    //Reset the form
    const handleCancel = () => {
        reset();
        setShowModal(false);
    };

    //Edit the User
    const handleEditUser = (user) => {
        setData({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            idNumber: user.idNumber,
            //profilePhoto: user.profilePhoto,
            role: user.role,
            birthdate: user.birthdate,
            gender: user.gender,
            //isEditing: true,
        });
        setShowModal(true);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {<FlashMessage message={flash.message} />}
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowModal={setShowModal}
            />
            <UserTable
                users={users}
                onPageChange={handlePageChange}
                onEditUser={handleEditUser}
                setShowModal={setShowModal}
                setData={setData}
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
