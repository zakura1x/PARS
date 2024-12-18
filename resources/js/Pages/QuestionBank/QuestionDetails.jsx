import React, { useState } from 'react';

const QuestionDetails = () => {
    const [formData, setFormData] = useState({
        subject_id: '',
        topic_id: '',
        user_id: '',
        question_text: '',
        format_type: 'Multiple Choice', // Default to Multiple Choice for now
        purpose: '',
        difficulty: '',
        options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
        ],
        weight: 1,
        attachment: null,
        status: 'active',
    });

    // Update form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Update options text or correctness
    const handleOptionChange = (index, key, value) => {
        const updatedOptions = [...formData.options];
        updatedOptions[index][key] = value;
        setFormData({ ...formData, options: updatedOptions });
    };

    // Handle File Upload
    const handleFileChange = (e) => {
        setFormData({ ...formData, attachment: e.target.files[0] });
    };

    // Static placeholder data for dropdowns
    const subjects = [
        { id: 1, name: 'Accounting' },
        { id: 2, name: 'Finance' },
        { id: 3, name: 'Taxation' },
    ];

    const topics = [
        { id: 1, name: 'Basics of Accounting' },
        { id: 2, name: 'Financial Statements' },
    ];

    const purposes = ['Practice', 'Pre-Test', 'Post-Test'];
    const difficulties = ['Easy', 'Moderate', 'Difficult'];

    return (
        <form className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold mb-4">Add New Question</h2>

            {/* Subject, Topic */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label>Subject</label>
                    <input
                        type="text"
                        name="subject_id"
                        value={formData.subject_id}
                        onChange={handleChange}
                        placeholder="Enter Subject"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label>Topic</label>
                    <input
                        type="text"
                        name="topic_id"
                        value={formData.topic_id}
                        onChange={handleChange}
                        placeholder="Enter Topic"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
            </div>

            {/* Purpose, Difficulty */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label>Purpose</label>
                    <select
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Purpose</option>
                        {purposes.map((purpose, index) => (
                            <option key={index} value={purpose}>
                                {purpose}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Difficulty</label>
                    <select
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="">Select Difficulty</option>
                        {difficulties.map((difficulty, index) => (
                            <option key={index} value={difficulty}>
                                {difficulty}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Question Text */}
            <div className="mb-4">
                <label>Question Text</label>
                <textarea
                    name="question_text"
                    value={formData.question_text}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    rows="3"
                    placeholder="Enter your question here"
                />
            </div>

            {/* Dynamic Options with Selectable Correct Answer */}
            <div className="mb-4">
                <label>Options</label>
                {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) =>
                                handleOptionChange(index, 'isCorrect', e.target.checked)
                            }
                            className="form-checkbox h-5 w-5"
                        />
                        <input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) =>
                                handleOptionChange(index, 'text', e.target.value)
                            }
                            className="w-full border rounded px-3 py-2 ml-2"
                        />
                    </div>
                ))}
            </div>

            {/* File Upload */}
            <div className="mb-4">
                <label>Attachment (Optional)</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full border rounded px-3 py-2"
                />
            </div>

            {/* Weight and Status */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label>Weight</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        min="1"
                        className="w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full border rounded px-3 py-2"
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4">
                <button
                    type="reset"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                    Reset
                </button>
                <button
                    type="button"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Save Question
                </button>
            </div>
        </form>
    );
};

export default QuestionDetails;
