import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"

export function PerformanceMetrics({ metrics }) {
  // Transform proficiency distribution for the chart
  const proficiencyData = Object.entries(metrics.proficiency_distribution).map(([level, count]) => ({
    name: getProficiencyLabel(level),
    value: count,
  }))

  // Create data for the score comparison chart
  const scoreData = [
    { name: "Your Average", score: metrics.average_score },
  ]

  // Colors for the pie chart
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"]

  // Calculate total topics
  const totalTopics = proficiencyData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-80">
        <h3 className="text-sm font-medium mb-2">Score Comparison</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="h-80">
        <h3 className="text-sm font-medium mb-2">Proficiency Distribution</h3>
        <div className="flex flex-col h-full">
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={proficiencyData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={100} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value, name, props) => [`${value} topics`, props.payload.name]}
                labelFormatter={() => ""}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {proficiencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <LabelList dataKey="label" position="right" style={{ fill: "#666", fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="border-t border-gray-200 mt-2 pt-2 text-sm text-center">Total Topics: {totalTopics}</div>
        </div>
      </div>
    </div>
  )
}

// Helper function to render custom labels on the pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Helper function to convert proficiency level to label
function getProficiencyLabel(level) {
    const map = {
        "1": "Beginner",
        "2": "Intermediate",
        "3": "Advanced",
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
    }

    return map[level.toLowerCase()] || level
}
