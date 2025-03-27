"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Calendar, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getStudentById, getStudentEvents } from "@/lib/data"

export default function StudentDashboard() {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState<any>(null)
  const [studentEvents, setStudentEvents] = useState<any>({ recentEvents: [] })

  useEffect(() => {
    if (user) {
      // Get student data
      const data = getStudentById(user.id)
      if (data) {
        setStudentData(data)
      }

      // Get student events
      const events = getStudentEvents(user.id)
      if (events) {
        setStudentEvents({
          recentEvents: events.past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        })
      }
    }
  }, [user])

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  if (!studentData) {
    return (
      <DashboardLayout role="student">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-muted rounded-md"></div>
            <div className="h-4 w-48 bg-muted rounded-md"></div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Student Info and Points Summary */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.name}</div>
              <p className="text-xs text-muted-foreground">{studentData.id}</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <span>{studentData.department}</span>
                <span className="mx-1">•</span>
                <span>Semester {studentData.semester}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.totalPoints} / {studentData.targetPoints}
              </div>
              <p className="text-xs text-muted-foreground">Points earned so far</p>
              <Progress value={(studentData.totalPoints / studentData.targetPoints) * 100} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Events Participated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentEvents.recentEvents.length}</div>
              <p className="text-xs text-muted-foreground">Total events attended</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  {studentEvents.recentEvents.length > 0
                    ? `Last event: ${formatDate(studentEvents.recentEvents[0].date)}`
                    : "No events yet"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentEvents.recentEvents.filter((e) => e.status === "verified").length} /{" "}
                {studentEvents.recentEvents.length}
              </div>
              <p className="text-xs text-muted-foreground">Events verified</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                <span>
                  {studentEvents.recentEvents.length > 0
                    ? `${Math.round((studentEvents.recentEvents.filter((e) => e.status === "verified").length / studentEvents.recentEvents.length) * 100)}% verification rate`
                    : "No events to verify"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points Breakdown and Recent Events */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5" />
                Points Breakdown
              </CardTitle>
              <CardDescription>Distribution of your activity points by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Technical Activities</span>
                    <span className="font-medium">{studentData.pointsBreakdown.technical} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.technical / studentData.totalPoints) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Cultural Activities</span>
                    <span className="font-medium">{studentData.pointsBreakdown.cultural} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.cultural / studentData.totalPoints) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Sports Activities</span>
                    <span className="font-medium">{studentData.pointsBreakdown.sports} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.sports / studentData.totalPoints) * 100}
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Social Service</span>
                    <span className="font-medium">{studentData.pointsBreakdown.social} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.social / studentData.totalPoints) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your most recent event participations</CardDescription>
            </CardHeader>
            <CardContent>
              {studentEvents.recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {studentEvents.recentEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.organizer}</p>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="font-bold">
                          {event.points} pts
                        </Badge>
                        <Badge
                          variant={event.status === "verified" ? "default" : "secondary"}
                          className={event.status === "verified" ? "bg-green-500" : ""}
                        >
                          {event.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Calendar className="h-10 w-10 mb-2 opacity-20" />
                  <p>No events participated yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

