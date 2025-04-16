"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Calendar, CheckCircle, Clock, GraduationCap, Book, Dumbbell, HeartHandshake, Plus, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { getStudentById, getStudentEvents } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Event {
  id: number;
  title: string;
  organizer: string;
  date: string;
  points: number;
  status: string;
  participants?: number;
  description?: string;
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState<any>(null)
  const [studentEvents, setStudentEvents] = useState<{ recentEvents: Event[] }>({ recentEvents: [] })

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
          recentEvents: events.past.sort((a: Event, b: Event) => new Date(b.date).getTime() - new Date(a.date).getTime()),
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

  // Calculate progress percentage
  const progressPercentage = (studentData.totalPoints / studentData.targetPoints) * 100;
  const progressStatus = progressPercentage >= 100 ? "complete" : progressPercentage >= 75 ? "good" : progressPercentage >= 50 ? "average" : "needs-work";

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        {/* Student Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-heading">Welcome, {studentData.name.split(' ')[0]}!</h2>
            <p className="text-muted-foreground">
              Your activity points dashboard - Track your progress and achievements
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Certificate
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              View Progress Report
            </Button>
          </div>
        </div>

        {/* Quick Progress Overview */}
        <Card className="bg-gradient-to-r from-indigo-500/10 to-indigo-400/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold mb-1">Activity Points Progress</h3>
                <p className="text-sm text-muted-foreground mb-2">You've completed {studentData.activityPoints} out of 100 required points</p>
                <div className="w-full md:w-80 h-3 bg-background/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${Math.min(100, (studentData.activityPoints / 100) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                <div className="flex flex-col items-center justify-center p-3 bg-background/50 rounded-lg">
                  <span className="text-2xl font-bold text-primary">{studentData.activityPoints}</span>
                  <span className="text-xs text-muted-foreground">Current Points</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-background/50 rounded-lg">
                  <span className="text-2xl font-bold">{100 - studentData.activityPoints}</span>
                  <span className="text-xs text-muted-foreground">Points Needed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info and Points Summary */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover-effect overflow-hidden border-t-4 border-t-indigo-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Student Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentData.name}</div>
              <p className="text-xs text-muted-foreground">{studentData.id}</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <GraduationCap className="mr-1 h-4 w-4 text-indigo-500" />
                <span>{studentData.department}</span>
                <span className="mx-1">•</span>
                <span>Semester {studentData.semester}</span>
              </div>
            </CardContent>
          </Card>
          <Card className={cn(
            "card-hover-effect overflow-hidden border-t-4",
            progressStatus === "complete" ? "border-t-green-500" : 
            progressStatus === "good" ? "border-t-blue-500" : 
            progressStatus === "average" ? "border-t-amber-500" : 
            "border-t-rose-500"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Activity Points</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentData.totalPoints} / {studentData.targetPoints}
              </div>
              <p className="text-xs text-muted-foreground">Points earned so far</p>
              <Progress 
                value={progressPercentage} 
                className="mt-2"
                color={
                  progressStatus === "complete" ? "bg-green-500" : 
                  progressStatus === "good" ? "bg-blue-500" : 
                  progressStatus === "average" ? "bg-amber-500" : 
                  "bg-rose-500"
                }
              />
              <p className="text-xs mt-1 font-medium text-right" style={{
                color: progressStatus === "complete" ? "rgb(34, 197, 94)" : 
                       progressStatus === "good" ? "rgb(59, 130, 246)" : 
                       progressStatus === "average" ? "rgb(245, 158, 11)" : 
                       "rgb(244, 63, 94)"
              }}>
                {progressPercentage.toFixed(0)}% complete
              </p>
            </CardContent>
          </Card>
          <Card className="card-hover-effect overflow-hidden border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Events Participated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentEvents.recentEvents.length}</div>
              <p className="text-xs text-muted-foreground">Total events attended</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4 text-purple-500" />
                <span>
                  {studentEvents.recentEvents.length > 0
                    ? `Last event: ${formatDate(studentEvents.recentEvents[0].date)}`
                    : "No events yet"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover-effect overflow-hidden border-t-4 border-t-teal-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {studentEvents.recentEvents.filter((e: Event) => e.status === "verified").length} /{" "}
                {studentEvents.recentEvents.length}
              </div>
              <p className="text-xs text-muted-foreground">Events verified</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <CheckCircle className="mr-1 h-4 w-4 text-teal-500" />
                <span>
                  {studentEvents.recentEvents.length > 0
                    ? `${Math.round((studentEvents.recentEvents.filter((e: Event) => e.status === "verified").length / studentEvents.recentEvents.length) * 100)}% verification rate`
                    : "No events to verify"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Points Breakdown and Recent Events */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="card-hover-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-amber-500" />
                Points Breakdown
              </CardTitle>
              <CardDescription>Distribution of your activity points by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Book className="mr-2 h-4 w-4 text-blue-500" />
                      <span>Technical Activities</span>
                    </div>
                    <span className="font-medium">{studentData.pointsBreakdown.technical} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.technical / studentData.totalPoints) * 100}
                    className="h-2 bg-muted"
                    color="bg-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4 text-purple-500" />
                      <span>Cultural Activities</span>
                    </div>
                    <span className="font-medium">{studentData.pointsBreakdown.cultural} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.cultural / studentData.totalPoints) * 100}
                    className="h-2 bg-muted"
                    color="bg-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Dumbbell className="mr-2 h-4 w-4 text-rose-500" />
                      <span>Sports Activities</span>
                    </div>
                    <span className="font-medium">{studentData.pointsBreakdown.sports} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.sports / studentData.totalPoints) * 100}
                    className="h-2 bg-muted"
                    color="bg-rose-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <HeartHandshake className="mr-2 h-4 w-4 text-green-500" />
                      <span>Social Service</span>
                    </div>
                    <span className="font-medium">{studentData.pointsBreakdown.social} points</span>
                  </div>
                  <Progress
                    value={(studentData.pointsBreakdown.social / studentData.totalPoints) * 100}
                    className="h-2 bg-muted"
                    color="bg-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover-effect">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-indigo-500" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your most recent event participations</CardDescription>
            </CardHeader>
            <CardContent>
              {studentEvents.recentEvents.length > 0 ? (
                <div className="space-y-4">
                  {studentEvents.recentEvents.slice(0, 3).map((event: Event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded-md transition-colors"
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
                        <Badge variant="outline" className="font-bold bg-primary/10 text-primary border-primary/20">
                          {event.points} pts
                        </Badge>
                        <Badge
                          variant={event.status === "verified" ? "default" : "secondary"}
                          className={event.status === "verified" ? "bg-green-500/10 text-green-600 border-green-200" : "bg-yellow-500/10 text-yellow-600 border-yellow-200"}
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

        {/* Recent Activities */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your latest submissions and activities</CardDescription>
          </CardHeader>
          <CardContent>
            {studentEvents.recentEvents.length > 0 ? (
              <div className="space-y-4">
                {studentEvents.recentEvents.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 rounded-lg transition-all hover:bg-muted/50">
                    <div className={cn(
                      "p-2 rounded-full",
                      event.status === "verified" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                      event.status === "pending" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                    )}>
                      {event.status === "verified" ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : event.status === "pending" ? (
                        <Clock className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{event.title}</p>
                        <div className="flex items-center">
                          <Badge variant={
                            event.status === "verified" ? "success" :
                            event.status === "pending" ? "warning" : "destructive"
                          } className="mr-2">
                            {event.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{event.date}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <div className="flex items-center pt-1">
                        <div className="flex items-center mr-4">
                          <Award className="h-4 w-4 mr-1 text-primary" />
                          <span className="text-xs">{event.points} points</span>
                        </div>
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 mr-1 text-primary" />
                          <span className="text-xs">{event.organizer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No recent activities</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  You haven't submitted any activity certificates yet. Add your first activity to start earning points.
                </p>
                <Button variant="outline" size="sm" className="mt-4 gap-2">
                  <Plus className="h-4 w-4" />
                  Add Activity
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Categories */}
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-4">Points Distribution by Category</h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="card-hover-effect">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Book className="h-8 w-8 text-blue-500 mb-2" />
                    <h4 className="font-medium">Academic</h4>
                    <p className="text-2xl font-bold mt-1">
                      {studentData.categoryPoints?.academic || 0}
                      <span className="text-sm font-normal text-muted-foreground"> / 30</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border-4" style={{
                    borderColor: `conic-gradient(rgb(59, 130, 246) ${(studentData.categoryPoints?.academic || 0) / 30 * 100}%, transparent 0)`,
                  }}>
                    <span className="text-xs font-medium">{Math.round((studentData.categoryPoints?.academic || 0) / 30 * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-hover-effect">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <Dumbbell className="h-8 w-8 text-green-500 mb-2" />
                    <h4 className="font-medium">Sports</h4>
                    <p className="text-2xl font-bold mt-1">
                      {studentData.categoryPoints?.sports || 0}
                      <span className="text-sm font-normal text-muted-foreground"> / 20</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border-4" style={{
                    borderColor: `conic-gradient(rgb(34, 197, 94) ${(studentData.categoryPoints?.sports || 0) / 20 * 100}%, transparent 0)`,
                  }}>
                    <span className="text-xs font-medium">{Math.round((studentData.categoryPoints?.sports || 0) / 20 * 100)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

