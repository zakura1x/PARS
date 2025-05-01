import { useState } from "react"
import { router, usePage } from "@inertiajs/react"
import { Book, Search, BookOpen, ChevronRight, Bookmark } from 'lucide-react'

const StudentStudyMaterial = ({ subjects }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const { route } = usePage().props

  // Function to handle component click and redirect to studentShowTopics
  const handleComponentClick = (subjectId) => {
    router.visit(`/study-materials/view/${subjectId}`);
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.subject_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Generate a random pastel color for each subject
  const getSubjectColor = (id) => {
    const colors = [
      "bg-blue-100 border-blue-300 text-blue-800",
      "bg-green-100 border-green-300 text-green-800",
      "bg-purple-100 border-purple-300 text-purple-800",
      "bg-yellow-100 border-yellow-300 text-yellow-800",
      "bg-pink-100 border-pink-300 text-pink-800",
      "bg-indigo-100 border-indigo-300 text-indigo-800",
      "bg-red-100 border-red-300 text-red-800",
      "bg-orange-100 border-orange-300 text-orange-800",
    ]
    return colors[id % colors.length]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <BookOpen className="h-8 w-8 text-[#64946a] mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Study Materials</h1>
        </div>
        <div className="relative w-full md:w-64">
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-[#64946a] focus:border-[#64946a] text-sm"
                placeholder="Search subjects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {filteredSubjects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No subjects found</h3>
          <p className="mt-2 text-sm text-gray-500">Try adjusting your search or check back later for new subjects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSubjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => handleComponentClick(subject.id)}
              className={`relative overflow-hidden rounded-xl shadow-md border-l-4 ${getSubjectColor(
                subject.id
              )} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{subject.name}</h2>
                    <p className="text-sm text-gray-500 mb-4">ID: {subject.subject_id}</p>
                  </div>
                </div>

                {subject.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
                )}

                <div className="flex items-center justify-end mt-2 text-[#64946a] font-medium text-sm">
                  View Topics
                  <ChevronRight className="h-4 w-4 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentStudyMaterial
