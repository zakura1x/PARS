import { useState, useEffect } from "react";

const FlashMessage = ({ message }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setVisible(false); // Hide message after 3 seconds
            }, 3000);

            return () => clearTimeout(timer); // Clean up the timer on component unmount
        }
    }, [message]);

    const handleClose = () => {
        setVisible(false); // Hide message when user clicks the close button
    };

    if (!message || !visible) return null; // If no message or message is hidden, render nothing

    return (
        <div className="fixed top-5 right-5 bg-green-400 text-white px-6 py-4 rounded-md shadow-lg flex items-center">
            <span className="mr-4">{message}</span>
            <button className="text-xl font-semibold" onClick={handleClose}>
                ×
            </button>
        </div>
    );
};

export default FlashMessage;
