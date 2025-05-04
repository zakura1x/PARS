import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/misc/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/misc/ui/table"
import { Badge } from "@/components/misc/ui/badge"
import { format } from "date-fns"  // Import format from date-fns

export function RecentAssessments({ examinations, practices, showAll = false }) {
  return (
    <Tabs defaultValue="examinations" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="examinations">Examinations</TabsTrigger>
        <TabsTrigger value="practices">Practice</TabsTrigger>
      </TabsList>

      <TabsContent value="examinations">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment</TableHead>
              <TableHead>created</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {examinations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No examination assessments found
                </TableCell>
              </TableRow>
            ) : (
              examinations.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.assessment.title}</TableCell>
                  <TableCell>
                    {format(new Date(exam.created_at), "PPpp")} {/* Format to include date and time */}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getScoreBadgeVariant(exam.result.score)}>{exam.result.score}%</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>

      <TabsContent value="practices">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {practices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No practice assessments found
                </TableCell>
              </TableRow>
            ) : (
              practices.map((practice) => (
                <TableRow key={practice.id}>
                  <TableCell className="font-medium">{practice.subject.name}</TableCell>
                  <TableCell>
                    {format(new Date(practice.submitted_at), "PPpp")} {/* Format to include date and time */}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getScoreBadgeVariant(practice.results.score_percentage)}>{practice.results.score_percentage}%</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TabsContent>
    </Tabs>
  )
}

// Helper function to determine badge variant based on score
function getScoreBadgeVariant(score) {
  if (score >= 90) return "default"
  if (score >= 70) return "secondary"
  if (score >= 50) return "outline"
  return "destructive"
}
