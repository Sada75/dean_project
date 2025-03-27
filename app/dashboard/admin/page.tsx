"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText, GraduationCap, Search, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { students, clubs, events, verifyEvent } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingEvents, setPendingEvents] = useState(events.filter((event) => event.status === "pending"))

  // Admin data summary
  const adminData = {
    totalStudents: students.length,
    totalClubs: clubs.length,
    pendingVerifications: events.filter((e) => e.status === "pending").length,
    totalEvents: events.length,
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Handle event verification
  const handleVerifyEvent = (eventId: number) => {
    const result = verifyEvent(eventId)

    if (result.success) {
      // Update local state to reflect verification
      setPendingEvents(pendingEvents.filter((event) => event.id !== eventId))

      toast({
        title: "Event verified",
        description: "The event has been successfully verified",
      })
    } else {
      toast({
        title: "Verification failed",
        description: result.message || "Failed to verify the event",
        variant: "destructive",
      })
    }
  }

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search",
        description: "Please enter a search term",
      })
      return
    }

    toast({
      title: "Search results",
      description: `Search functionality is limited in this demo version.`,
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Admin Summary */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <GraduationCap className="mr-1 h-4 w-4" />
                <span>Active student accounts</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.totalClubs}</div>
              <p className="text-xs text-muted-foreground">Active clubs</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                <span>Student organizations</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">Events awaiting approval</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4 text-yellow-500" />
                <span>Require your verification</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Events organized</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>Across all clubs</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Quick Actions */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-4">
          <div className="relative sm:col-span-3">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students, clubs, or events..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
          </div>
          <Button
            onClick={() => {
              toast({
                title: "Generate Reports",
                description: "This feature is not implemented in the demo version.",
              })
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Reports
          </Button>
        </div>

        {/* Pending Verifications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
            <CardDescription>Events awaiting your verification and approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">Organized by: {event.organizer}</p>
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
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            toast({
                              title: event.title,
                              description: event.description,
                            })
                          }}
                        >
                          View Details
                        </Button>
                        <Button size="sm" className="h-8" onClick={() => handleVerifyEvent(event.id)}>
                          Verify
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <CheckCircle className="h-10 w-10 mb-2 opacity-20" />
                <p>No pending verifications</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Management Dashboard</CardTitle>
            <CardDescription>Manage students, clubs, and events</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="clubs">Clubs</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>
              <TabsContent value="students" className="mt-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="font-medium">Student Name</div>
                    <div className="font-medium">ID</div>
                    <div className="font-medium">Department</div>
                    <div className="font-medium">Points</div>
                    <div className="font-medium">Actions</div>
                  </div>
                  {students.map((student, index) => (
                    <div key={index} className="flex items-center justify-between border-b px-4 py-3 last:border-0">
                      <div>{student.name}</div>
                      <div className="text-muted-foreground">{student.id}</div>
                      <div>{student.department}</div>
                      <div>
                        <Badge variant="outline">{student.totalPoints} pts</Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "View Student",
                            description: `Viewing details for ${student.name}`,
                          })
                        }}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/dashboard/admin/students")}
                >
                  View All Students
                </Button>
              </TabsContent>
              <TabsContent value="clubs" className="mt-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="font-medium">Club Name</div>
                    <div className="font-medium">ID</div>
                    <div className="font-medium">Events</div>
                    <div className="font-medium">Status</div>
                    <div className="font-medium">Actions</div>
                  </div>
                  {clubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between border-b px-4 py-3 last:border-0">
                      <div>{club.name}</div>
                      <div className="text-muted-foreground">{club.id}</div>
                      <div>{club.totalEvents}</div>
                      <div>
                        <Badge variant="outline" className="bg-green-500 text-white">
                          Active
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "View Club",
                            description: `Viewing details for ${club.name}`,
                          })
                        }}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" onClick={() => router.push("/dashboard/admin/clubs")}>
                  View All Clubs
                </Button>
              </TabsContent>
              <TabsContent value="events" className="mt-4">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="font-medium">Event Name</div>
                    <div className="font-medium">Organizer</div>
                    <div className="font-medium">Date</div>
                    <div className="font-medium">Status</div>
                    <div className="font-medium">Actions</div>
                  </div>
                  {events.slice(0, 5).map((event, index) => (
                    <div key={index} className="flex items-center justify-between border-b px-4 py-3 last:border-0">
                      <div>{event.title}</div>
                      <div className="text-muted-foreground">{event.organizer}</div>
                      <div>{formatDate(event.date)}</div>
                      <div>
                        <Badge
                          variant={event.status === "verified" ? "default" : "secondary"}
                          className={event.status === "verified" ? "bg-green-500" : ""}
                        >
                          {event.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          toast({
                            title: "View Event",
                            description: `Viewing details for ${event.title}`,
                          })
                        }}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() => router.push("/dashboard/admin/events")}
                >
                  View All Events
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

