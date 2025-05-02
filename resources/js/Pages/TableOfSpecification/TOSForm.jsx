"use client"

import { useForm, Link } from "@inertiajs/react"

const TOSForm = ({ topics, tosRecords, subjectId }) => {
  // First, organize topics and their subtopics
  const topLevelTopics = topics.filter((topic) => !topic.parent_id)
  const subtopics = topics.filter((topic) => topic.parent_id)

  // Create a hierarchical structure
  const organizedItems = []
  let topicCounter = 1

  // Process each top-level topic
  topLevelTopics.forEach((topic) => {
    // Get existing TOS record for this topic
    const existingTOS = tosRecords.find((tos) => tos.topic_id === topic.id)

    // Add the topic to our organized items
    organizedItems.push({
      id: topic.id,
      topic_id: topic.id,
      subtopic_id: null,
      name: topic.name,
      displayNumber: `${topicCounter}`,
      parent_id: null,
      difficulty: existingTOS
        ? {
            remembering: existingTOS.difficulty?.remembering ?? 0,
            understanding: existingTOS.difficulty?.understanding ?? 0,
            applying: existingTOS.difficulty?.applying ?? 0,
            analyzing: existingTOS.difficulty?.analyzing ?? 0,
            evaluating: existingTOS.difficulty?.evaluating ?? 0,
            creating: existingTOS.difficulty?.creating ?? 0,
          }
        : {
            remembering: 0,
            understanding: 0,
            applying: 0,
            analyzing: 0,
            evaluating: 0,
            creating: 0,
          },
      isSubtopic: false,
    })

    // Find all subtopics for this topic
    const relatedSubtopics = subtopics.filter((subtopic) => subtopic.parent_id === topic.id)
    let subtopicCounter = 1

    // Add each subtopic
    relatedSubtopics.forEach((subtopic) => {
      // Get existing TOS record for this subtopic
      const existingSubtopicTOS = tosRecords.find((tos) => tos.topic_id === subtopic.id)

      organizedItems.push({
        id: subtopic.id,
        topic_id: subtopic.id, // Using the subtopic's own ID as topic_id for TOS records
        subtopic_id: subtopic.id,
        name: subtopic.name,
        displayNumber: `${topicCounter}.${subtopicCounter}`,
        parent_id: topic.id,
        difficulty: existingSubtopicTOS
          ? {
              remembering: existingSubtopicTOS.difficulty?.remembering ?? 0,
              understanding: existingSubtopicTOS.difficulty?.understanding ?? 0,
              applying: existingSubtopicTOS.difficulty?.applying ?? 0,
              analyzing: existingSubtopicTOS.difficulty?.analyzing ?? 0,
              evaluating: existingSubtopicTOS.difficulty?.evaluating ?? 0,
              creating: existingSubtopicTOS.difficulty?.creating ?? 0,
            }
          : {
              remembering: 0,
              understanding: 0,
              applying: 0,
              analyzing: 0,
              evaluating: 0,
              creating: 0,
            },
        isSubtopic: true,
      })

      subtopicCounter++
    })

    topicCounter++
  })

  const { data, setData, post } = useForm({
    items: organizedItems,
    subject_id: subjectId,
  })

  const handleInputChange = (index, difficultyKey, value) => {
    const updatedData = [...data.items]
    updatedData[index].difficulty[difficultyKey] = Number.parseInt(value) || 0
    setData("items", updatedData)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post("/table-of-specification/save/form")
  }

  const difficultyKeys = ["remembering", "understanding", "applying", "analyzing", "evaluating", "creating"]

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumbs */}
      <div className="text-sm breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/table-of-specification/index">Table of Specification List</Link>
          </li>
          <li>
            <a>Table of Specification Details</a>
          </li>
        </ul>
      </div>
      <h1 className="text-2xl font-bold mb-4">Table of Specification (TOS)</h1>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto shadow-md">
          <table className="table w-full border border-gray-200">
            <thead>
                <tr className="bg-gray-300 text-slate-500">
                    <th className="w-1/4"></th>
                    <th className="text-center" colspan="7">COGNITIVE LEVELS</th>
                </tr>
                <tr className="bg-gray-300 text-slate-500">
                    <th className="w-1/4">TOPIC NAME</th>
                    <th>REMEMBERING</th>
                    <th>UNDERSTANDING</th>
                    <th>APPLYING</th>
                    <th>ANALYZING</th>
                    <th>EVALUATING</th>
                    <th>CREATING</th>
                    <th>TOTAL</th>
                </tr>
            </thead>

            <tbody>
              {data.items.map((item, index) => {
                // Compute total dynamically
                const total = Object.values(item.difficulty).reduce((sum, val) => sum + val, 0)

                return (
                  <tr key={item.id} className={item.isSubtopic ? "bg-gray-50" : ""}>
                    <td className="p-2">
                      <div className={`${item.isSubtopic ? "pl-6" : "font-medium"}`}>
                        {item.displayNumber}. {item.name}
                      </div>
                    </td>
                    {difficultyKeys.map((difficultyKey) => (
                      <td key={difficultyKey} className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={item.difficulty[difficultyKey]}
                          onChange={(e) => handleInputChange(index, difficultyKey, e.target.value)}
                          className="input input-bordered input-sm w-full bg-white"
                        />
                      </td>
                    ))}
                    {/* Display total as read-only */}
                    <td className="p-2 font-bold text-center">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 justify-end flex">
          <button type="submit" className="btn bg-green-700 text-white border-none hover:bg-black">
            SAVE
          </button>
        </div>
      </form>
    </div>
  )
}

export default TOSForm
