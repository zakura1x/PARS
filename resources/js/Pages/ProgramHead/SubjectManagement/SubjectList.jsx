import React, { useState } from "react";
import { usePage, Head, useForm, router } from "@inertiajs/react";
import Header from "../../../components/SubjectManagement/Header";
import SubjectTable from "../../../components/SubjectManagement/SubjectTable";
import AddSubjectModal from "../../../components/SubjectManagement/AddSubjectModal";
import FlashMessage from "../../../components/Notifications/FlashMessage";

const SubjectManagement = () => {
    const { flash, subjects, auth, professors } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Form state for adding/editing a subject
    const { data, setData, post, put, reset, errors, processing } = useForm({
        id: null,
        subject_id: "",
        name: "",
        professor_id: "",
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

    const handleCancel = () => {
        reset();
        setShowModal(false);
    };

    const handleEditSubject = (subject) => {
        setData({
            id: subject.id,
            subject_id: subject.subject_id,
            name: subject.name,
            professor_id: subject.professor_id ?? "",
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
                setShowModal={setShowModal}
                data={data}
                setData={setData}
                handleCancel={handleCancel}
                errors={errors}
                processing={processing}
                post={post}
                put={put}
                reset={reset}
                professors={professors}
            />
        </div>
    );
};

export default SubjectManagement;
