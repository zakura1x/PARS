import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/misc/ui/select"

export function SubjectSelector({ subjects, selectedSubject, onSelectSubject }) {
  return (
    <Select value={selectedSubject || ""} onValueChange={(value) => onSelectSubject(value === "all" ? null : value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="All Subjects" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Subjects</SelectItem>
        {subjects.map((subject) => (
          <SelectItem key={subject.id} value={subject.name}>
            {subject.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
