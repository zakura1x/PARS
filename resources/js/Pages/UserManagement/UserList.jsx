import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import Header from "../../components/UserManagement/Header";
import UserTable from "../../components/UserManagement/UserTable";
import AddUserModal from "../../components/UserManagement/AddUserModal";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    // const [newUser, setNewUser] = useState({
    //     firstName: "",
    //     lastName: "",
    //     email: "",
    //     idNumber: "",
    //     profilePhoto: "",
    //     role: "",
    //     birthdate: "",
    //     gender: "",
    // });

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

    //CHANGE TO REAL USERS
    const users = [
        {
            name: "Florence Shaw",
            email: "florence@untitledui.com",
            access: ["Admin"],
            dateAdded: "July 4, 2022",
        },
        // Other users...
    ];

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSaveChanges = (e) => {
        e.preventDefault();
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
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowModal={setShowModal}
            />
            <UserTable users={filteredUsers} />
            <AddUserModal
                showModal={showModal}
                setShowModal={setShowModal}
                handleSaveChanges={handleSaveChanges}
                handleCancel={handleCancel}
                date={data}
                setData={setData}
                errors={errors}
                processing={processing}
            />
        </div>
    );
};

export default UserManagement;
