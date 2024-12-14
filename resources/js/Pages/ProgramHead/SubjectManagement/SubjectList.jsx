import React, { useState } from "react";
import { usePage, useForm } from "@inertiajs/react";
import Header from "../../../components/SubjectManagement/Header";
import SubjectTable from "../../../components/SubjectManagement/SubjectTable";
import AddSubjectModal from "../../../components/SubjectManagement/AddSubjectModal";
import FlashMessage from "../../../components/Notifications/FlashMessage";

const SubjectManagement = ({ userId }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { flash, subjects } = usePage().props;

    //Initialize data for form
    const { data, setData, post, reset, errors, processing } = useForm({
        id: null,
        subject_id: "",
        name: "",
        created_by: userId,
        status: true,
    });

    const filteredSubjects = subjects.data.filter(
        (subject) =>
            subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (url) => {
        window.location.href = url;
    };

    // Save the subject
    const handleSave = (e) => {
        e.preventDefault();

        const url = data.id ? `/subjects/edit/${data.id}` : `/addSubject`;

        post(url, { ...data, status: data.status, _method: 'PUT' }, {
            onSuccess: () => {
                setShowModal(false);
                reset(); // Resets form data
            },
            onError: (errors) => {
                console.error("Error occurred:", errors);
                alert("An error occurred. Please check the form and try again.");
            },
        });
    };

    const handleCancel = () => {
        reset();
        setShowModal(false);
    }

    const handleEditSubject = (subject) => {
        setData({
            id: subject.id,
            subject_id: subject.subject_id,
            name: subject.name,
            status: subject.status,
        });
        setShowModal(true);
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {<FlashMessage message={flash.message} />}
            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setShowModal={setShowModal}
            />
            <SubjectTable
                subjects={subjects}
                onPageChange={handlePageChange}
                onSubjectUser={handleEditSubject}
                setShowModal={setShowModal}
                setData={setData}
            />

            <AddSubjectModal
                showModal={showModal}
                handleSaveChanges={handleSave}
                handleCancel={handleCancel}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
            />
        </div>
    );
};

export default SubjectManagement;
