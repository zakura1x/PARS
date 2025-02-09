const SubjectSelect = ({ subjects, selectedSubject, onChange, error }) => (
    <div className="form-control">
        <label className="label">
            <span className="label-text">Choose your subject</span>
        </label>
        <select
            id="subject"
            value={selectedSubject}
            onChange={onChange}
            className="select select-bordered w-full"
        >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                    {subject.name}
                </option>
            ))}
        </select>
        {error && <span className="text-error text-sm">{error}</span>}
    </div>
);

export default SubjectSelect;
