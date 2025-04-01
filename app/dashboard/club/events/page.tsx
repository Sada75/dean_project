"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Download, 
  Edit, 
  FileText, 
  MapPin, 
  Plus, 
  Trash2, 
  Upload, 
  Users 
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { getClubById, getClubEvents } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function ClubEventsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [clubData, setClubData] = useState<any>(null)
  const [clubEvents, setClubEvents] = useState<any>({ past: [], upcoming: [] })
  const [searchTerm, setSearchTerm] = useState("")

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

  // Filter events based on search term
  const filteredPastEvents = clubEvents.past.filter((event: any) => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const filteredUpcomingEvents = clubEvents.upcoming.filter((event: any) => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle download participant list
  const handleDownloadList = (eventId: number) => {
    toast({
      title: "Download Participant List",
      description: "This feature is not implemented in the demo version.",
    })
  }

  // Handle upload participation data
  const handleUploadData = (eventId: number) => {
    toast({
      title: "Upload Participation Data",
      description: "This feature is not implemented in the demo version.",
    })
  }

  // Handle edit event
  const handleEditEvent = (eventId: number) => {
    toast({
      title: "Edit Event",
      description: "This feature is not implemented in the demo version.",
    })
  }

  // Handle delete event
  const handleDeleteEvent = (eventId: number) => {
    toast({
      title: "Delete Event",
      description: "This feature is not implemented in the demo version.",
    })
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Manage Events</h1>
          <Button onClick={() => router.push("/dashboard/club/create")}>
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Button>
        </div>

        <div className="flex w-full max-w-sm items-center space-x-2 mb-4">
          <Input 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" size="icon" variant="ghost">
            <span className="sr-only">Search</span>
            <Calendar className="h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="pending">Pending Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            {filteredUpcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredUpcomingEvents.map((event: any) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>Upcoming Event</CardDescription>
                        </div>
                        <Badge variant="outline" className="font-bold">
                          {event.points} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{event.registeredStudents?.length || 0} students registered</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between space-y-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditEvent(event.id)}>
                              <Edit className="mr-1 h-3 w-3" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2 className="mr-1 h-3 w-3" /> Cancel
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDownloadList(event.id)}
                            className="w-full"
                          >
                            <Download className="mr-1 h-3 w-3" /> Download Registrations
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Calendar className="h-10 w-10 mb-2 opacity-20" />
                <p>No upcoming events found</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => router.push("/dashboard/club/create")}
                >
                  Create New Event
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            {filteredPastEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredPastEvents.map((event: any) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>Past Event</CardDescription>
                        </div>
                        <Badge 
                          variant={event.status === "verified" ? "default" : "secondary"}
                          className={event.status === "verified" ? "bg-green-500" : ""}
                        >
                          {event.status === "verified" ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{event.participants} students participated</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between space-y-2">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleUploadData(event.id)}
                              disabled={event.status === "verified"}
                            >
                              <Upload className="mr-1 h-3 w-3" /> Upload Data
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDownloadList(event.id)}
                            >
                              <Download className="mr-1 h-3 w-3" /> Download List
                            </Button>
                          </div>
                          {event.status === "verified" ? (
                            <Badge variant="outline" className="bg-green-500 text-white">
                              <CheckCircle className="mr-1 h-3 w-3" /> Points Awarded
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <Clock className="mr-1 h-3 w-3" /> Awaiting Verification
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <FileText className="h-10 w-10 mb-2 opacity-20" />
                <p>No past events found</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pending" className="mt-4">
            {filteredPastEvents.filter((event: any) => event.status === "pending").length > 0 ? (
              <div className="space-y-4">
                {filteredPastEvents
                  .filter((event: any) => event.status === "pending")
                  .map((event: any) => (
                    <Card key={event.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>Pending Verification</CardDescription>
                          </div>
                          <Badge variant="secondary">Pending</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{event.venue}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{event.participants} students participated</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end justify-between space-y-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleUploadData(event.id)}
                            >
                              <Upload className="mr-1 h-3 w-3" /> Upload Data
                            </Button>
                            <div className="text-sm text-muted-foreground">
                              <Clock className="inline mr-1 h-3 w-3" /> 
                              Waiting for admin verification
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <CheckCircle className="h-10 w-10 mb-2 opacity-20" />
                <p>No pending verifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 