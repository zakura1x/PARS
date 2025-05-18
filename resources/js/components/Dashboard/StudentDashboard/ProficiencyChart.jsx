import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

export function ProficiencyChart({ proficiencyData }) {
    // Transform data for the chart and normalize proficiency levels
    const chartData = proficiencyData.map((item) => {
        const level = normalizeProficiencyLevel(item.proficiency_level);
        return {
            name: item.topic.name,
            level: level,
            subject: item.topic.subject.name,
            originalLevel: item.proficiency_level, // Keep original for tooltip if needed
        };
    });

    // Colors for different proficiency levels
    const COLORS = ["#FF8042", "#FFBB28", "#00C49F"];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {["beginner", "intermediate", "advanced"].map(
                    (level, index) => (
                        <div key={level} className="badge badge-outline gap-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: COLORS[index] }}
                            />
                            <span>{capitalizeFirstLetter(level)}</span>
                        </div>
                    )
                )}
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={70}
                            interval={0}
                        />
                        <YAxis
                            domain={[0, 3]}
                            ticks={[1, 2, 3]}
                            tickFormatter={(value) =>
                                capitalizeFirstLetter(
                                    getProficiencyLabel(value)
                                )
                            }
                        />
                        <Tooltip
                            formatter={(value, name, props) => [
                                capitalizeFirstLetter(
                                    getProficiencyLabel(value)
                                ),
                                "Proficiency",
                            ]}
                            labelFormatter={(label) => `Topic: ${label}`}
                        />
                        <Bar dataKey="level" name="Proficiency Level">
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[entry.level - 1]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {proficiencyData.map((item, index) => {
                    const level = normalizeProficiencyLevel(
                        item.proficiency_level
                    );
                    return (
                        <div
                            key={item.id || index}
                            className="card bg-base-100 shadow-sm"
                        >
                            <div className="card-body p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-medium">
                                            {item.topic.name}
                                        </h3>
                                        <p className="text-sm opacity-70">
                                            {item.topic.subject.name}
                                        </p>
                                    </div>
                                    <span
                                        className="badge"
                                        style={{
                                            backgroundColor: COLORS[level - 1],
                                        }}
                                    >
                                        {capitalizeFirstLetter(
                                            item.proficiency_level
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Helper function to normalize proficiency level to number
function normalizeProficiencyLevel(level) {
    if (typeof level === "number") return level;

    switch (level.toLowerCase()) {
        case "beginner":
            return 1;
        case "intermediate":
            return 2;
        case "advanced":
            return 3;
        default:
            return 0;
    }
}

// Helper function to get proficiency label
function getProficiencyLabel(level) {
    if (typeof level === "string") return level.toLowerCase();

    switch (level) {
        case 1:
            return "beginner";
        case 2:
            return "intermediate";
        case 3:
            return "advanced";
        default:
            return `level ${level}`;
    }
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
