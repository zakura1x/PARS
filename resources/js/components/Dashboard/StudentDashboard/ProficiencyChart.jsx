import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent } from "@/components/misc/ui/card"
import { Badge } from "@/components/misc/ui/badge"

export function ProficiencyChart({ proficiencyData }) {
  // Ensure proficiencyData is populated and handle errors
  if (!proficiencyData || proficiencyData.length === 0) return <div>Loading...</div>

  // Transform data for the chart
  const chartData = proficiencyData.map((item) => ({
    name: item.topic.name,
    level: item.proficiency_level,
    subject: item.topic.subject.name,
  }))

  // Colors for different proficiency levels
  const COLORS = ["#FF8042", "#FFBB28", "#00C49F"]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map(
          (
            level, // Adjusted to 3 levels
          ) => (
            <Badge key={level} variant="outline" className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[level - 1] }} />
              <span>{getProficiencyLabel(level)}</span>
            </Badge>
          ),
        )}
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 3]}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(value) => (value === 0 ? "" : getProficiencyLabel(value))}
            />
            <YAxis dataKey="name" type="category" width={90} tickLine={false} />
            <Tooltip
              formatter={(value, name, props) => [getProficiencyLabel(value), "Proficiency"]}
              labelFormatter={(label) => `Topic: ${label}`}
            />
            <Bar dataKey="level" name="Proficiency Level" barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.level - 1]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proficiencyData.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.topic.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.topic.subject.name}</p>
                </div>
                <Badge className="ml-auto" style={{ backgroundColor: COLORS[item.proficiency_level - 1] }}>
                  {getProficiencyLabel(item.proficiency_level)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
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
    default:
      return `Level ${level}` // In case something unexpected happens
  }
}
