"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, FileText, GraduationCap, Search, Users, ArrowUpRight, Filter, Download, File, Archive } from "lucide-react"
import { Input } from "@/components/ui/input"
import { students, clubs, events, verifyEvent, counsellors } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, role } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [pendingEvents, setPendingEvents] = useState(events.filter((event) => event.status === "pending"))
  const isDean = role === "dean"

  // Admin data summary
  const adminData = {
    totalStudents: students.length,
    totalClubs: clubs.length,
    totalCounsellors: counsellors.length,
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
    <DashboardLayout role={isDean ? "dean" : "admin"}>
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight font-heading">
              {isDean ? "Dean Student Affairs Dashboard" : "Admin Dashboard"}
            </h2>
            <p className="text-muted-foreground">
              {isDean 
                ? "Manage all students, clubs, and activity points" 
                : "Administrative overview of the activity points system"}
            </p>
          </div>
        </div>

        {/* Admin Summary */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-hover-effect overflow-hidden border-t-4 border-t-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <GraduationCap className="mr-1 h-4 w-4 text-blue-500" />
                <span>Active student accounts</span>
              </div>
            </CardContent>
          </Card>
          <Card className="card-hover-effect overflow-hidden border-t-4 border-t-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.totalClubs}</div>
              <p className="text-xs text-muted-foreground">Active clubs</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4 text-purple-500" />
                <span>Student organizations</span>
              </div>
            </CardContent>
          </Card>

          {/* For dean, show counsellor count instead of pending verification */}
          {isDean ? (
            <Card className="card-hover-effect overflow-hidden border-t-4 border-t-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Counsellors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{adminData.totalCounsellors}</div>
                <p className="text-xs text-muted-foreground">Faculty counsellors</p>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1 h-4 w-4 text-green-500" />
                  <span>Active counsellor accounts</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-hover-effect overflow-hidden border-t-4 border-t-yellow-500">
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
          )}
          <Card className="card-hover-effect overflow-hidden border-t-4 border-t-rose-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{adminData.totalEvents}</div>
              <p className="text-xs text-muted-foreground">Events organized</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4 text-rose-500" />
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
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
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
        <Card className="card-hover-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDean ? "Club Reports Pending Verification" : "Pending Verifications"}
              <Badge variant="outline" className={cn(
                "ml-2 font-normal",
                pendingEvents.length > 0 ? "bg-yellow-500/10 text-yellow-600 border-yellow-200" : "bg-green-500/10 text-green-600 border-green-200"
              )}>
                {pendingEvents.length} {pendingEvents.length === 1 ? "item" : "items"}
              </Badge>
            </CardTitle>
            <CardDescription>
              {isDean 
                ? "Reports submitted by clubs awaiting your verification and approval" 
                : "Events awaiting your verification and approval"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingEvents.length > 0 ? (
              <div className="space-y-4">
                {pendingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between rounded-lg border p-4 transition-all hover:shadow-md hover:bg-background/50">
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
                      <Badge variant="outline" className="font-bold bg-primary/10 text-primary border-primary/20">
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
                        <Button 
                          size="sm" 
                          className="h-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                          onClick={() => handleVerifyEvent(event.id)}
                        >
                          {isDean ? "Approve Report" : "Verify"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <CheckCircle className="h-10 w-10 mb-2 opacity-20 text-green-500" />
                <p>No pending verifications</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Management Tabs */}
        <Card className="card-hover-effect">
          <CardHeader>
            <CardTitle className="flex items-center">
              {isDean ? "Institution Management" : "Management Dashboard"}
              <ArrowUpRight className="ml-2 h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription>{isDean ? "Manage all aspects of the activity points system" : "Manage students, clubs, and events"}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="students" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="students">Students</TabsTrigger>
                <TabsTrigger value="clubs">Clubs</TabsTrigger>
                {isDean ? <TabsTrigger value="counsellors">Counsellors</TabsTrigger> : <TabsTrigger value="events">Events</TabsTrigger>}
                {isDean && <TabsTrigger value="records">Records</TabsTrigger>}
              </TabsList>
              <TabsContent value="students" className="mt-0">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between bg-muted/50 border-b px-4 py-3">
                    <div className="font-medium">Student Name</div>
                    <div className="font-medium">ID</div>
                    <div className="font-medium">Department</div>
                    <div className="font-medium">Points</div>
                    <div className="font-medium">Actions</div>
                  </div>
                  {students.slice(0, 5).map((student, index) => (
                    <div key={index} className="flex items-center justify-between border-b px-4 py-3 last:border-0 hover:bg-muted/20 transition-colors">
                      <div>{student.name}</div>
                      <div className="text-muted-foreground">{student.id}</div>
                      <div>{student.department}</div>
                      <div>
                        <Badge variant="outline" className={cn(
                          "bg-primary/10 text-primary border-primary/20",
                          student.totalPoints >= student.targetPoints && "bg-green-500/10 text-green-600 border-green-200"
                        )}>
                          {student.totalPoints} / {student.targetPoints}
                        </Badge>
                      </div>
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            toast({
                              title: `View student: ${student.name}`,
                              description: "This action is not implemented in the demo",
                            })
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {isDean && (
                  <div className="mt-4 text-right">
                    <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                      View All Students
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="clubs" className="mt-0">
                <div className="rounded-md border">
                  <div className="flex items-center justify-between bg-muted/50 border-b px-4 py-3">
                    <div className="font-medium">Club Name</div>
                    <div className="font-medium">Faculty Advisor</div>
                    <div className="font-medium">Members</div>
                    <div className="font-medium">Events Count</div>
                    <div className="font-medium">Actions</div>
                  </div>
                  {clubs.map((club, index) => (
                    <div key={index} className="flex items-center justify-between border-b px-4 py-3 last:border-0 hover:bg-muted/20 transition-colors">
                      <div>{club.name}</div>
                      <div className="text-muted-foreground">{club.description.split(' ')[0]}</div>
                      <div>{club.totalEvents}</div>
                      <div>{club.totalEvents}</div>
                      <div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8"
                          onClick={() => {
                            toast({
                              title: `View club: ${club.name}`,
                              description: "This action is not implemented in the demo",
                            })
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {isDean && (
                  <div className="mt-4 text-right">
                    <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                      View All Clubs
                    </Button>
                  </div>
                )}
              </TabsContent>

              {isDean ? (
                <TabsContent value="counsellors" className="mt-0">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between bg-muted/50 border-b px-4 py-3">
                      <div className="font-medium">Name</div>
                      <div className="font-medium">Department</div>
                      <div className="font-medium">Email</div>
                      <div className="font-medium">Students Assigned</div>
                      <div className="font-medium">Actions</div>
                    </div>
                    {counsellors.map((counsellor, index) => (
                      <div key={index} className="flex items-center justify-between border-b px-4 py-3 last:border-0 hover:bg-muted/20 transition-colors">
                        <div>{counsellor.name}</div>
                        <div className="text-muted-foreground">{counsellor.department}</div>
                        <div>{counsellor.email}</div>
                        <div>{counsellor.students?.length || 0}</div>
                        <div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => {
                              toast({
                                title: `View counsellor: ${counsellor.name}`,
                                description: "This action is not implemented in the demo",
                              })
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                      View All Counsellors
                    </Button>
                  </div>
                </TabsContent>
              ) : (
                <TabsContent value="events" className="mt-0">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between bg-muted/50 border-b px-4 py-3">
                      <div className="font-medium">Event Title</div>
                      <div className="font-medium">Organizer</div>
                      <div className="font-medium">Date</div>
                      <div className="font-medium">Status</div>
                      <div className="font-medium">Actions</div>
                    </div>
                    {events.slice(0, 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between border-b px-4 py-3 last:border-0 hover:bg-muted/20 transition-colors">
                        <div>{event.title}</div>
                        <div className="text-muted-foreground">{event.organizer}</div>
                        <div>{formatDate(event.date)}</div>
                        <div>
                          <Badge variant={event.status === "verified" ? "default" : event.status === "pending" ? "outline" : "secondary"} className={
                            event.status === "verified" ? "bg-green-500/10 text-green-600 border-green-200" : 
                            event.status === "pending" ? "bg-yellow-500/10 text-yellow-600 border-yellow-200" : ""
                          }>
                            {event.status}
                          </Badge>
                        </div>
                        <div>
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
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}

              {isDean && (
                <TabsContent value="records" className="mt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search records..."
                            className="w-full pl-8 md:w-80"
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select defaultValue="all">
                          <SelectTrigger className="w-[180px]">
                            <div className="flex items-center">
                              <Filter className="mr-2 h-4 w-4" />
                              <SelectValue placeholder="Filter by type" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Records</SelectItem>
                            <SelectItem value="student">Student Records</SelectItem>
                            <SelectItem value="event">Event Records</SelectItem>
                            <SelectItem value="certificate">Certificates</SelectItem>
                            <SelectItem value="report">Reports</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="flex items-center justify-between bg-muted/50 border-b px-4 py-3">
                        <div className="font-medium">Record Title</div>
                        <div className="font-medium">Type</div>
                        <div className="font-medium">Added By</div>
                        <div className="font-medium">Date</div>
                        <div className="font-medium">Actions</div>
                      </div>
                      
                      {/* Sample Records */}
                      <div className="flex items-center justify-between border-b px-4 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Final Year Event Reports</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">Report</Badge>
                        </div>
                        <div className="text-muted-foreground">Dean Office</div>
                        <div>June 15, 2023</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">View</Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b px-4 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-green-500" />
                          <span>Student Activity Certificates 2023</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">Certificate</Badge>
                        </div>
                        <div className="text-muted-foreground">Activity Coordinator</div>
                        <div>May 28, 2023</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">View</Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b px-4 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-amber-500" />
                          <span>Student Points Database</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">Database</Badge>
                        </div>
                        <div className="text-muted-foreground">System</div>
                        <div>April 10, 2023</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">View</Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between border-b px-4 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-purple-500" />
                          <span>Annual Club Activities Report</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-200">Report</Badge>
                        </div>
                        <div className="text-muted-foreground">Clubs Coordinator</div>
                        <div>March 22, 2023</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">View</Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center">
                          <Archive className="h-4 w-4 mr-2 text-indigo-500" />
                          <span>Archived Student Data 2022</span>
                        </div>
                        <div>
                          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-600 border-indigo-200">Archive</Badge>
                        </div>
                        <div className="text-muted-foreground">System</div>
                        <div>December 15, 2022</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-8">View</Button>
                          <Button size="sm" variant="outline" className="h-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700">
                        <FileText className="h-4 w-4" />
                        Add New Record
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

