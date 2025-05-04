"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

export function ProficiencyChart({ proficiencyData }) {
  // Transform data for the chart
  const chartData = proficiencyData.map((item) => ({
    name: item.topic.name,
    level: item.proficiency_level,
    subject: item.topic.subject.name,
  }))

  // Colors for different proficiency levels - now only 3 colors
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F"]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {/* Changed to only show 3 levels */}
        {[1, 2, 3].map((level) => (
          <div key={level} className="badge badge-outline gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[level - 1] }} />
            <span>{getProficiencyLabel(level)}</span>
          </div>
        ))}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} interval={0} />
            {/* Updated domain and ticks for 3 levels */}
            <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={getProficiencyLabel} />
            <Tooltip
              formatter={(value, name, props) => [getProficiencyLabel(value), "Proficiency"]}
              labelFormatter={(label) => `Topic: ${label}`}
            />
            <Bar dataKey="level" name="Proficiency Level">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.level - 1]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proficiencyData.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.topic.name}</h3>
                  <p className="text-sm opacity-70">{item.topic.subject.name}</p>
                </div>
                <span className="badge" style={{ backgroundColor: COLORS[item.proficiency_level - 1] }}>
                  {getProficiencyLabel(item.proficiency_level)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to convert proficiency level to label - removed Expert level
function getProficiencyLabel(level) {
  switch (level) {
    case 1:
      return "Beginner"
    case 2:
      return "Intermediate"
    case 3:
      return "Advanced"
    default:
      return `Level ${level}`
  }
}
