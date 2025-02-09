const SelectedTopics = ({ selectedTopics, topics, onRemoveTopic, error }) => (
    <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
            <h2 className="card-title">Selected Topics</h2>
            <div className="flex flex-wrap gap-2">
                {selectedTopics.map((topicId) => {
                    const topic = topics.find((t) => t.id === topicId);
                    return (
                        <span
                            key={topicId}
                            onClick={() => onRemoveTopic(topicId)}
                            className="badge badge-primary badge-lg cursor-pointer"
                        >
                            {topic ? `${topic.name}` : `${topicId}`} &times;
                        </span>
                    );
                })}
            </div>
            {error && <span className="text-error text-sm">{error}</span>}
        </div>
    </div>
);

export default SelectedTopics;
