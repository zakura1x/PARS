import { usePage, useForm } from "@inertiajs/react";
import { useState, useRef, useEffect } from "react";
import { router } from "@inertiajs/react";

const ProfileAccount = () => {
    const { user, flash } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [avatarAction, setAvatarAction] = useState("view"); // "view" or "update"
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [notification, setNotification] = useState(null);
    const fileInputRef = useRef(null);

    // Form for password update
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "", // Changed to match Laravel's expected field name
    });

    // Check for flash messages on component mount or when flash changes
    useEffect(() => {
        if (flash.success) {
            setNotification({
                type: "success",
                message: flash.success,
            });

            // Auto-hide notification after 5 seconds
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const openAvatarModal = (action = "view") => {
        setAvatarAction(action);
        setIsAvatarModalOpen(true);
        setSelectedAvatar(null);
        setAvatarPreview(null);
    };

    const closeAvatarModal = () => {
        setIsAvatarModalOpen(false);
        setSelectedAvatar(null);
        setAvatarPreview(null);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedAvatar(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarSubmit = (e) => {
        e.preventDefault();

        if (!selectedAvatar) {
            closeAvatarModal();
            return;
        }

        const formData = new FormData();
        formData.append("avatar", selectedAvatar);

        // Using Inertia's router to submit the form
        router.post("/profile/update-avatar", formData);
        closeAvatarModal();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.new_password !== data.new_password_confirmation) {
            setNotification({
                type: "error",
                message: "New password and confirmation don't match",
            });
            return;
        }

        // Using the form's post method to submit
        post("/profile/update-password");
        // Modal will be closed on successful response via the flash message effect
    };

    // Function to dismiss notification manually
    const dismissNotification = () => {
        setNotification(null);
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            {/* Success/Error Notification */}
            {notification && (
                <div
                    className={`alert ${
                        notification.type === "success"
                            ? "alert-success"
                            : "alert-error"
                    } mb-4`}
                >
                    <div>
                        <span>{notification.message}</span>
                    </div>
                    <div className="flex-none">
                        <button
                            onClick={dismissNotification}
                            className="btn btn-sm btn-ghost"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Header section with user info */}
            <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div
                        className="avatar cursor-pointer overflow-visible w-24 h-24"
                        onClick={() => openAvatarModal("view")}
                    >
                        <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                            {user.avatar ? (
                                <img
                                    src={user.avatar || "/placeholder.svg"}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff&size=200`;
                                    }}
                                />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff&size=200`}
                                    alt={`${user.first_name} ${user.last_name}`}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex-1">
                        <h1 className="text-2xl font-bold">
                            {user.first_name} {user.last_name}
                        </h1>
                        <div className="mt-1">
                            <span className="font-semibold">Role: </span>
                            <span className="capitalize">
                                {user.role.replace("_", " ")}
                            </span>
                        </div>
                        <div className="mt-1">
                            <span className="font-semibold">Email: </span>
                            <span className="text-blue-600">{user.email}</span>
                        </div>
                        <div className="mt-1">
                            <span className="font-semibold">Status: </span>
                            <span
                                className={`badge ${
                                    user.status
                                        ? "badge-success"
                                        : "badge-error"
                                }`}
                            >
                                {user.status ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User information section */}
            <div className="card bg-base-100 shadow-md">
                <div className="card-body">
                    <h2 className="card-title text-lg border-b pb-2 mb-4">
                        User Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">
                                First name
                            </div>
                            <div className="w-2/3">{user.first_name}</div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">Last name</div>
                            <div className="w-2/3">{user.last_name}</div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">Email</div>
                            <div className="w-2/3">{user.email}</div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">ID Number</div>
                            <div className="w-2/3">{user.idNumber}</div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">Role</div>
                            <div className="w-2/3 capitalize">
                                {user.role.replace("_", " ")}
                            </div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">Status</div>
                            <div className="w-2/3">
                                <span
                                    className={`badge ${
                                        user.status
                                            ? "badge-success"
                                            : "badge-error"
                                    }`}
                                >
                                    {user.status ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">
                                Created at
                            </div>
                            <div className="w-2/3">
                                {new Date(user.created_at).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="flex border-b pb-2">
                            <div className="w-1/3 font-semibold">
                                Updated at
                            </div>
                            <div className="w-2/3">
                                {new Date(user.updated_at).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="card-actions justify-end mt-6">
                        <button
                            className="btn btn-outline btn-sm btn-error"
                            onClick={openModal}
                        >
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Update Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Update Password</h3>
                        <form onSubmit={handleSubmit} className="py-4">
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">
                                        Current Password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    className={`input input-bordered w-full ${
                                        errors.current_password
                                            ? "input-error"
                                            : ""
                                    }`}
                                    value={data.current_password}
                                    onChange={(e) =>
                                        setData(
                                            "current_password",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {errors.current_password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.current_password}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">
                                        New Password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    className={`input input-bordered w-full ${
                                        errors.new_password ? "input-error" : ""
                                    }`}
                                    value={data.new_password}
                                    onChange={(e) =>
                                        setData("new_password", e.target.value)
                                    }
                                    required
                                />
                                {errors.new_password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {errors.new_password}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text">
                                        Confirm New Password
                                    </span>
                                </label>
                                <input
                                    type="password"
                                    className={`input input-bordered w-full ${
                                        data.new_password !==
                                            data.new_password_confirmation &&
                                        data.new_password_confirmation
                                            ? "input-error"
                                            : ""
                                    }`}
                                    value={data.new_password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "new_password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                {data.new_password !==
                                    data.new_password_confirmation &&
                                    data.new_password_confirmation && (
                                        <label className="label">
                                            <span className="label-text-alt text-error">
                                                Passwords don't match
                                            </span>
                                        </label>
                                    )}
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        processing ||
                                        data.new_password !==
                                            data.new_password_confirmation
                                    }
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}

            {/* Avatar Modal */}
            {isAvatarModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <h3 className="font-bold text-lg mb-4">
                            {avatarAction === "view"
                                ? "Profile Picture"
                                : "Update Profile Picture"}
                        </h3>

                        {avatarAction === "view" ? (
                            <div className="flex flex-col items-center">
                                <div className="w-64 h-64 rounded-lg overflow-hidden mb-4">
                                    {user.avatar ? (
                                        <img
                                            src={
                                                user.avatar ||
                                                "/placeholder.svg"
                                            }
                                            alt={`${user.first_name} ${user.last_name}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff&size=400`;
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff&size=400`}
                                            alt={`${user.first_name} ${user.last_name}`}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="modal-action w-full">
                                    <button
                                        className="btn btn-primary"
                                        onClick={() =>
                                            setAvatarAction("update")
                                        }
                                    >
                                        Change Picture
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={closeAvatarModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleAvatarSubmit}
                                className="py-4"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-64 h-64 rounded-lg overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
                                        {avatarPreview ? (
                                            <img
                                                src={
                                                    avatarPreview ||
                                                    "/placeholder.svg"
                                                }
                                                alt="Avatar Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : user.avatar ? (
                                            <img
                                                src={
                                                    user.avatar ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`${user.first_name} ${user.last_name}`}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff&size=400`;
                                                }}
                                            />
                                        ) : (
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random&color=fff&size=400`}
                                                alt={`${user.first_name} ${user.last_name}`}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>

                                    <div className="form-control w-full max-w-xs mb-4">
                                        <input
                                            type="file"
                                            className="file-input file-input-bordered w-full"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            ref={fileInputRef}
                                        />
                                        <label className="label">
                                            <span className="label-text-alt">
                                                Select a new profile picture
                                                (max 2MB)
                                            </span>
                                        </label>
                                    </div>

                                    <div className="modal-action w-full">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={!selectedAvatar}
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            className="btn"
                                            onClick={closeAvatarModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                    <div
                        className="modal-backdrop"
                        onClick={closeAvatarModal}
                    ></div>
                </div>
            )}
        </div>
    );
};

export default ProfileAccount;
