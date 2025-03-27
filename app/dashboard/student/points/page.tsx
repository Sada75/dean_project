"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/lib/auth-context"
import { getStudentById } from "@/lib/data"

export default function StudentPointsPage() {
  const { user } = useAuth()
  const [studentData, setStudentData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      // Get student data
      const data = getStudentById(user.id)
      if (data) {
        setStudentData(data)
      }
    }
  }, [user])

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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Activity Points</h1>
        </div>

        {/* Points Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Points Overview</CardTitle>
            <CardDescription>Your progress towards the required activity points</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <div className="text-4xl font-bold">
                {studentData.totalPoints} / {studentData.targetPoints}
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round((studentData.totalPoints / studentData.targetPoints) * 100)}% of target achieved
              </p>
              <div className="w-full max-w-md">
                <Progress value={(studentData.totalPoints / studentData.targetPoints) * 100} className="h-3" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Technical</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{studentData.pointsBreakdown.technical}</div>
                  <p className="text-xs text-muted-foreground">Points earned</p>
                  <Progress
                    value={(studentData.pointsBreakdown.technical / studentData.totalPoints) * 100}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Cultural</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{studentData.pointsBreakdown.cultural}</div>
                  <p className="text-xs text-muted-foreground">Points earned</p>
                  <Progress
                    value={(studentData.pointsBreakdown.cultural / studentData.totalPoints) * 100}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Sports</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{studentData.pointsBreakdown.sports}</div>
                  <p className="text-xs text-muted-foreground">Points earned</p>
                  <Progress
                    value={(studentData.pointsBreakdown.sports / studentData.totalPoints) * 100}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">Social</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{studentData.pointsBreakdown.social}</div>
                  <p className="text-xs text-muted-foreground">Points earned</p>
                  <Progress
                    value={(studentData.pointsBreakdown.social / studentData.totalPoints) * 100}
                    className="mt-2 h-2"
                  />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Points Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Points Requirements</CardTitle>
            <CardDescription>Understanding the activity points system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Overview</h3>
              <p className="text-sm text-muted-foreground">
                Activity points are awarded for participation in various extracurricular and co-curricular activities.
                Students are required to earn a minimum of 100 points before graduation.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Category Requirements</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Technical Activities</h4>
                    <p className="text-sm text-muted-foreground">Minimum 30 points required</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{studentData.pointsBreakdown.technical} / 30</div>
                    <p className="text-sm text-muted-foreground">
                      {studentData.pointsBreakdown.technical >= 30 ? "Requirement met" : "Requirement not met"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Cultural Activities</h4>
                    <p className="text-sm text-muted-foreground">Minimum 20 points required</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{studentData.pointsBreakdown.cultural} / 20</div>
                    <p className="text-sm text-muted-foreground">
                      {studentData.pointsBreakdown.cultural >= 20 ? "Requirement met" : "Requirement not met"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Sports Activities</h4>
                    <p className="text-sm text-muted-foreground">Minimum 20 points required</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{studentData.pointsBreakdown.sports} / 20</div>
                    <p className="text-sm text-muted-foreground">
                      {studentData.pointsBreakdown.sports >= 20 ? "Requirement met" : "Requirement not met"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Social Service</h4>
                    <p className="text-sm text-muted-foreground">Minimum 20 points required</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{studentData.pointsBreakdown.social} / 20</div>
                    <p className="text-sm text-muted-foreground">
                      {studentData.pointsBreakdown.social >= 20 ? "Requirement met" : "Requirement not met"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                  <div>
                    <h4 className="font-medium">Additional Points</h4>
                    <p className="text-sm text-muted-foreground">Remaining points from any category</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {studentData.totalPoints -
                        Math.min(studentData.pointsBreakdown.technical, 30) -
                        Math.min(studentData.pointsBreakdown.cultural, 20) -
                        Math.min(studentData.pointsBreakdown.sports, 20) -
                        Math.min(studentData.pointsBreakdown.social, 20)}{" "}
                      / 10
                    </div>
                    <p className="text-sm text-muted-foreground">Flexible requirement</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

