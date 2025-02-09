const TopicList = ({ topics, onTopicClick }) => (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">Available Topics</h2>
            <div className="overflow-x-auto max-h-64">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(topics) && topics.length > 0 ? (
                            topics.map((topic) => (
                                <tr
                                    key={topic.id}
                                    className="hover:bg-base-200 cursor-pointer"
                                    onClick={() => onTopicClick(topic)}
                                >
                                    <td>{topic.name}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="text-center py-4 text-gray-500">
                                    No topics found...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

export default TopicList;
