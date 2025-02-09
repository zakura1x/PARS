const TopicSearch = ({ search, onChange }) => (
    <div className="form-control">
        <label htmlFor="search" className="label">
            <span className="label-text">Search Topics:</span>
        </label>
        <input
            type="text"
            id="search"
            value={search}
            onChange={onChange}
            placeholder="Search topics..."
            className="input input-bordered w-full"
        />
    </div>
);

export default TopicSearch;
