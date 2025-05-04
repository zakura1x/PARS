import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

export function PerformanceMetrics({ metrics }) {
  // Transform proficiency distribution for the chart
  const proficiencyData = Object.entries(metrics.proficiency_distribution).map(([level, count]) => ({
    name: getProficiencyLabel(Number.parseInt(level)),
    value: count,
  }))

  // Create data for the score comparison chart
  const scoreData = [
    { name: "Your Average", score: metrics.average_score },
    { name: "Class Average", score: 72.5 }, // This could be fetched from backend in the future
  ]

  // Colors for the pie chart
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"]

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
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={proficiencyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {proficiencyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
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
  switch (level) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    case 4:
      return "Expert"
    default:
      return `Level ${level}`
  }
}
