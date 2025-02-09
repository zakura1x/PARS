const ConfirmationDialog = ({ onConfirm, onCancel }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
                Confirm Assessment Creation
            </h2>
            <p className="mb-6">
                Are you sure you want to create this assessment? This will
                affect your overall Grade.
            </p>
            <div className="flex justify-end space-x-4">
                <button className="btn btn-error" onClick={onCancel}>
                    Cancel
                </button>
                <button className="btn btn-success" onClick={onConfirm}>
                    Yes, Create
                </button>
            </div>
        </div>
    </div>
);

export default ConfirmationDialog;
