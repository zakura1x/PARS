import { Link } from "@inertiajs/react"

const TOSView = ({ topics, tosRecords, subjectId, subjectName }) => {
  // First, organize topics and their subtopics
  const topLevelTopics = topics.filter((topic) => !topic.parent_id)
  const subtopics = topics.filter((topic) => topic.parent_id)

  // Create a hierarchical structure
  const organizedItems = []
  let topicCounter = 1

  // Process each top-level topic
  topLevelTopics.forEach((topic) => {
    // Get existing TOS record for this topic
    const topicTOS = tosRecords.find((tos) => tos.topic_id === topic.id)

    if (topicTOS) {
      // Add the topic to our organized items
      organizedItems.push({
        ...topicTOS,
        displayNumber: `${topicCounter}`,
        isSubtopic: false,
        topic: topic,
      })
    }

    // Find all subtopics for this topic
    const relatedSubtopics = subtopics.filter((subtopic) => subtopic.parent_id === topic.id)
    let subtopicCounter = 1

    // Add each subtopic
    relatedSubtopics.forEach((subtopic) => {
      // Get existing TOS record for this subtopic
      const subtopicTOS = tosRecords.find((tos) => tos.topic_id === subtopic.id)

      if (subtopicTOS) {
        organizedItems.push({
          ...subtopicTOS,
          displayNumber: `${topicCounter}.${subtopicCounter}`,
          isSubtopic: true,
          topic: subtopic,
        })

        subtopicCounter++
      }
    })

    topicCounter++
  })

  // Calculate totals for each difficulty level
  const totals = {
    remembering: 0,
    understanding: 0,
    applying: 0,
    analyzing: 0,
    evaluating: 0,
    creating: 0,
    percentage: 0,
    num_questions: 0,
  }

  organizedItems.forEach((item) => {
    totals.remembering += item.difficulty.remembering || 0
    totals.understanding += item.difficulty.understanding || 0
    totals.applying += item.difficulty.applying || 0
    totals.analyzing += item.difficulty.analyzing || 0
    totals.evaluating += item.difficulty.evaluating || 0
    totals.creating += item.difficulty.creating || 0
    totals.num_questions += item.num_questions || 0
  })

  // Calculate overall percentage
  if (organizedItems.length > 0) {
    totals.percentage = Math.round(totals.num_questions / organizedItems.length)
  }

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/table-of-specification/index">Table of Specification List</Link>
          </li>
          <li>
            <a>Table of Specification View</a>
          </li>
        </ul>
      </div>
      <h1 className="text-2xl font-bold mb-4">Table of Specification (TOS)</h1>

      {/* Displaying Subject Information */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Subject ID: {subjectId}</h2>
      </div>

      {/* TOS Table */}
      <div className="overflow-x-auto shadow-md">
        <table className="table w-full border border-gray-200">
            <thead>
                <tr className="bg-gray-300 text-slate-500">
                    <th className="w-1/4"></th>
                    <th className="text-center" colSpan="8">COGNITIVE LEVELS</th>
                </tr>
                <tr className="bg-gray-300 text-slate-500">
                    <th className="w-1/4">TOPIC NAME</th>
                    <th>REMEMBERING</th>
                    <th>UNDERSTANDING</th>
                    <th>APPLYING</th>
                    <th>ANALYZING</th>
                    <th>EVALUATING</th>
                    <th>CREATING</th>
                    <th>PERCENTAGE</th>
                    <th>TOTAL</th>
                </tr>
            </thead>
          <tbody>
            {organizedItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No TOS records found for this subject.
                </td>
              </tr>
            ) : (
              <>
                {organizedItems.map((item, index) => (
                  <tr key={index} className={item.isSubtopic ? "bg-gray-50" : ""}>
                    <td className="p-2">
                      <div className={`${item.isSubtopic ? "pl-6" : "font-medium"}`}>
                        {item.displayNumber}. {item.topic?.name}
                      </div>
                    </td>
                    <td className="text-center">{item.difficulty.remembering || 0}</td>
                    <td className="text-center">{item.difficulty.understanding || 0}</td>
                    <td className="text-center">{item.difficulty.applying || 0}</td>
                    <td className="text-center">{item.difficulty.analyzing || 0}</td>
                    <td className="text-center">{item.difficulty.evaluating || 0}</td>
                    <td className="text-center">{item.difficulty.creating || 0}</td>
                    <td className="text-center">{item.percentage || 0}%</td>
                    <td className="text-center">{item.num_questions || 0}</td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr className="bg-gray-200 font-bold">
                  <td className="p-2">TOTAL</td>
                  <td className="text-center">{totals.remembering}</td>
                  <td className="text-center">{totals.understanding}</td>
                  <td className="text-center">{totals.applying}</td>
                  <td className="text-center">{totals.analyzing}</td>
                  <td className="text-center">{totals.evaluating}</td>
                  <td className="text-center">{totals.creating}</td>
                  <td className="text-center"></td>
                  <td className="text-center">{totals.num_questions}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TOSView
