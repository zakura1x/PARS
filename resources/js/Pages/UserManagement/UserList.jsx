import React, { useState } from "react";
import Header from "../../components/UserManagement/Header";
import UserTable from "../../components/UserManagement/UserTable";
import AddUserModal from "../../components/UserManagement/AddUserModal";

const UserManagement = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        firstName: "",
        lastName: "",
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

    const handleSaveChanges = () => {
        if (newUser.firstName && newUser.lastName && newUser.email) {
            console.log("User saved:", newUser);
            setShowModal(false);
            handleCancel(); // Clear fields after saving
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const handleCancel = () => {
        setNewUser({
            firstName: "",
            lastName: "",
            email: "",
            idNumber: "",
            profilePhoto: "",
            role: "",
            birthdate: "",
            gender: "",
        });
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
                newUser={newUser}
                setNewUser={setNewUser}
                handleSaveChanges={handleSaveChanges}
                handleCancel={handleCancel}
            />
        </div>
    );
};

export default UserManagement;
