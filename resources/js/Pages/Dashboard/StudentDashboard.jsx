import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/misc/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/misc/ui/tabs"
import { PerformanceMetrics } from "../../components/Dashboard/StudentDashboard/PerformanceMetrics"
import { RecentAssessments } from "../../components/Dashboard/StudentDashboard/RecentAssessment"
import { ProficiencyChart } from "../../components/Dashboard/StudentDashboard/ProficiencyChart"
import { SubjectSelector } from "../../components/Dashboard/StudentDashboard/SubjectSelector"
import { BookOpen, GraduationCap, BarChart, Clock } from "lucide-react"
import { usePage } from "@inertiajs/react"

export default function StudentDashboard() {
  // Accessing data passed from the backend via Inertia
  const {
    student,
    recentAssessments,
    proficiencyData,
    performanceMetrics,
    subjects,
    selectedSubject,
    auth,
  } = usePage().props

  const user = auth.user

  const [selectedSubjectState, setSelectedSubject] = useState(selectedSubject)

  // Filter proficiency data by selected subject
  const filteredProficiencyData = selectedSubjectState
    ? proficiencyData.filter((item) => item.topic.subject.name === selectedSubjectState)
    : proficiencyData

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-medium tracking-tight">{user.full_name} - Dashboard</h2>
          <div className="flex items-center space-x-2">
            <SubjectSelector
              subjects={subjects}
              selectedSubject={selectedSubjectState}
              onSelectSubject={(subject) => setSelectedSubject(subject)}
            />
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
            <TabsTrigger value="proficiency">Proficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.average_score}%</div>
                  <p className="text-xs text-muted-foreground">Across all assessments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.assessment_completion_rate}%</div>
                  <p className="text-xs text-muted-foreground">Of assigned assessments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assessments Taken</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{performanceMetrics.total_assessments_taken}</div>
                  <p className="text-xs text-muted-foreground">Total completed assessments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proficiency Level</CardTitle>
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Object.entries(performanceMetrics.proficiency_distribution).reduce(
                      (max, [level, count]) => (Number.parseInt(level) > max ? Number.parseInt(level) : max),
                      0,
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Most common proficiency level</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <PerformanceMetrics metrics={performanceMetrics} />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                  <CardDescription>Your most recent examination and practice assessments</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentAssessments
                    examinations={recentAssessments.examinations.slice(0, 3)}
                    practices={recentAssessments.practices.slice(0, 3)}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assessments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Assessments</CardTitle>
                <CardDescription>View all your completed and pending assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentAssessments
                  examinations={recentAssessments.examinations}
                  practices={recentAssessments.practices}
                  showAll={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="proficiency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Topic Proficiency</CardTitle>
                <CardDescription>
                  Your proficiency levels across different topics
                  {selectedSubjectState && ` in ${selectedSubjectState}`}
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ProficiencyChart proficiencyData={filteredProficiencyData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
