import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ProficiencyOverviewChart({ data }) {
  const barHeight = 40; // height per topic in pixels
  const chartHeight = data.length * barHeight;

  return (
    <div className="card bg-base-200 shadow-xl mb-6">
      <div className="card-body">
        <h2 className="card-title">STUDENT'S PROFICIENCY OVERVIEW</h2>
        <div style={{ height: chartHeight + 'px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="topic" type="category" width={70} />
              <Tooltip />
              <Bar dataKey="beginner" stackId="a" fill="#8B0000" name="Beginner" />
              <Bar dataKey="intermediate" stackId="a" fill="#FFA500" name="Intermediate" />
              <Bar dataKey="advanced" stackId="a" fill="#FF0000" name="Advanced" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
