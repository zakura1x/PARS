import React, { useState } from "react";
import { usePage, Head, useForm, router } from "@inertiajs/react";
import Header from "../../../components/SubjectManagement/Header";
import SubjectTable from "../../../components/SubjectManagement/SubjectTable";
import AddSubjectModal from "../../../components/SubjectManagement/AddSubjectModal";
import FlashMessage from "../../../components/Notifications/FlashMessage";

const SubjectManagement = () => {
    const { flash, subjects, auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Form state for adding/editing a subject
    const { data, setData, post, reset, errors, processing } = useForm({
        id: null,
        subject_id: "",
        name: "",
        created_by: auth.user.id,
        status: true,
    });

    // Filtered subjects based on search query
    const filteredSubjects = subjects.data.filter((subject) =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearch = () => {
        router.get(
            "/subjects",
            { searchQuery },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handlePageChange = (url) => {
        if (url) {
            router.get(url, {}, { preserveState: true, preserveScroll: true });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();

        const url = data.id ? `/subjects/edit/${data.id}` : `/addSubject`;

        post(
            url,
            { ...data, _method: data.id ? "PUT" : "POST" },
            {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            }
        );
    };

    const handleCancel = () => {
        reset();
        setShowModal(false);
    };

    const handleEditSubject = (subject) => {
        setData({
            id: subject.id,
            subject_id: subject.subject_id,
            name: subject.name,
            status: subject.status,
        });
        setShowModal(true);
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Head title="Subject Management" />
            {flash.message && <FlashMessage message={flash.message} />}

            <Header
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                setShowModal={setShowModal}
            />

            <SubjectTable
                subjects={{ ...subjects, data: filteredSubjects }}
                onEditSubject={handleEditSubject}
                onPageChange={handlePageChange}
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
