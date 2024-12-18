import React from "react";

const QuestionTable = () => {
    return (
        <div className="m-4 overflow-x-auto">
            <table className="table table-xs table-pin-rows table-pin-cols rounded-md">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Question</td>
                        <td>Difficulty</td>
                        <td>Date Added</td>
                        <td>Author</td>
                        <td>Subject</td>
                        <td>Topic</td>
                        <td>Status</td>
                    </tr>
                </thead>
            </table>
        </div>
    );
};

export default QuestionTable;
