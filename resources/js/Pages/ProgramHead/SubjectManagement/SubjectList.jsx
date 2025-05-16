import { useState, useEffect } from "react";
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

    // Debug logs
    //console.log("Modal render - showModal:", showModal);

    // Reset form when modal is closed
    useEffect(() => {
        if (!showModal) {
            reset();
        }
    }, [showModal]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = data.id ? `/subjects/edit/${data.id}` : `/addSubject`;

        const options = {
            onSuccess: () => {
                console.log("Success callback executing");
                // Manually close the modal
                setShowModal(false);
                reset();
            },
            onError: (errors) => {
                console.log("Errors:", errors);
            },
            onFinish: () => {
                console.log("Request completed");
            },
        };

        if (data.id) {
            put(url, options);
        } else {
            post(url, options);
        }
    };

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
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                errors={errors}
                processing={processing}
                professors={professors}
            />
        </div>
    );
};

export default SubjectManagement;
