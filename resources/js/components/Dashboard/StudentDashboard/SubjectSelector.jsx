export function SubjectSelector({ subjects, selectedSubject, onSelectSubject }) {
  return (
    <div className="form-control w-full max-w-xs">
      <select
        className="select select-bordered"
        value={selectedSubject || ""}
        onChange={(e) => onSelectSubject(e.target.value === "all" ? null : e.target.value)}
      >
        <option value="all">All Subjects</option>
        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name}
          </option>
        ))}
      </select>
    </div>
  )
}
