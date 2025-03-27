"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText, Plus, Upload, Users } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getClubById, getClubEvents } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function ClubDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [clubData, setClubData] = useState<any>(null)
  const [clubEvents, setClubEvents] = useState<any>({ past: [], upcoming: [] })

  useEffect(() => {
    if (user) {
      // Get club data
      const data = getClubById(user.id)
      if (data) {
        setClubData(data)
      }

      // Get club events
      const events = getClubEvents(user.id)
      if (events) {
        setClubEvents(events)
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

  if (!clubData) {
    return (
      <DashboardLayout role="club">
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
    <DashboardLayout role="club">
      <div className="space-y-6">
        {/* Club Info and Summary */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Club Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubData.name}</div>
              <p className="text-xs text-muted-foreground">Club ID: {clubData.id}</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                <span>Student Organization</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubData.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Events organized</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>
                  {clubEvents.past.length > 0 ? `Last event: ${formatDate(clubEvents.past[0].date)}` : "No events yet"}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubData.pendingVerification}</div>
              <p className="text-xs text-muted-foreground">Events awaiting approval</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4 text-yellow-500" />
                <span>Awaiting admin verification</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clubData.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">Scheduled events</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                <span>Ready for student registration</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Button className="h-24 flex-col gap-2" onClick={() => router.push("/dashboard/club/create")}>
            <Plus className="h-6 w-6" />
            <span>Create New Event</span>
          </Button>
          <Button
            className="h-24 flex-col gap-2"
            variant="outline"
            onClick={() => {
              toast({
                title: "Upload Participation Data",
                description: "This feature is not implemented in the demo version.",
              })
            }}
          >
            <Upload className="h-6 w-6" />
            <span>Upload Participation Data</span>
          </Button>
          <Button
            className="h-24 flex-col gap-2"
            variant="outline"
            onClick={() => {
              toast({
                title: "Generate Reports",
                description: "This feature is not implemented in the demo version.",
              })
            }}
          >
            <FileText className="h-6 w-6" />
            <span>Generate Reports</span>
          </Button>
        </div>

        {/* Event Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Manage your events and track verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="pending">Pending Verification</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {clubEvents.past.length > 0 ? (
                  <div className="space-y-4">
                    {clubEvents.past.map((event) => (
                      <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                          <p className="font-medium">{event.title}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="mr-1 h-4 w-4" />
                            <span>{event.participants} participants</span>
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
                    <p>No events organized yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => router.push("/dashboard/club/create")}
                    >
                      Create Your First Event
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                {clubEvents.past.filter((event) => event.status === "pending").length > 0 ? (
                  <div className="space-y-4">
                    {clubEvents.past
                      .filter((event) => event.status === "pending")
                      .map((event) => (
                        <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <p className="font-medium">{event.title}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="mr-1 h-4 w-4" />
                              <span>{event.participants} participants</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="font-bold">
                              {event.points} pts
                            </Badge>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mb-2 opacity-20" />
                    <p>No pending events</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="verified" className="mt-4">
                {clubEvents.past.filter((event) => event.status === "verified").length > 0 ? (
                  <div className="space-y-4">
                    {clubEvents.past
                      .filter((event) => event.status === "verified")
                      .map((event) => (
                        <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-1">
                            <p className="font-medium">{event.title}</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="mr-1 h-4 w-4" />
                              <span>{event.participants} participants</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline" className="font-bold">
                              {event.points} pts
                            </Badge>
                            <Badge variant="default" className="bg-green-500">
                              Verified
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <CheckCircle className="h-10 w-10 mb-2 opacity-20" />
                    <p>No verified events</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

