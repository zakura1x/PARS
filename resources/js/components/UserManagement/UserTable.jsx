import { useState } from "react";
import { router } from "@inertiajs/react";
import Pagination from "../misc/Pagination";
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

const UserTable = ({ users, setShowModal, setData }) => {
    const [deleteUserId, setDeleteUserId] = useState(null);

    const handlePageChange = (url) => {
        if (url) {
            router.get(url);
        }
    };

    const handleDelete = (id) => {
        setDeleteUserId(id);
        document.getElementById("delete_modal").showModal();
    };

    const confirmDelete = () => {
        if (deleteUserId) {
            router.delete(`/users/${deleteUserId}`);
            document.getElementById("delete_modal").close();
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "professor":
                return "badge badge-info";
            case "program_head":
                return "badge badge-success";
            default:
                return "badge badge-warning";
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Date Added</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.data?.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No users found...
                                </td>
                            </tr>
                        ) : (
                            users.data.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.idNumber}</td>
                                    <td>{user.full_name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={getRoleBadgeClass(
                                                user.role
                                            )}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(
                                            user.created_at
                                        ).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex space-x-2">
                                            <button
                                                className="btn btn-ghost btn-sm"
                                                onClick={() => {
                                                    setShowModal(true);
                                                    setData({
                                                        id: user.id,
                                                        first_name:
                                                            user.first_name,
                                                        last_name:
                                                            user.last_name,
                                                        email: user.email,
                                                        idNumber: user.idNumber,
                                                        profilePhoto:
                                                            user.profile_photo,
                                                        role: user.role,
                                                        birthdate:
                                                            user.birthdate,
                                                        gender: user.gender,
                                                    });
                                                }}
                                            >
                                                <FaRegEdit size={18} />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-sm text-error"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                            >
                                                <MdDeleteOutline size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                <Pagination data={users} onPageChange={handlePageChange} />
            </div>

            <dialog
                id="delete_modal"
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Confirm Delete</h3>
                    <p className="py-4">
                        Are you sure you want to delete this user?
                    </p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-ghost mr-2">
                                Cancel
                            </button>
                            <button
                                className="btn btn-error"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default UserTable;
