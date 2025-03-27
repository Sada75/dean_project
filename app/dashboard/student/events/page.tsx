"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getStudentEvents, registerForEvent } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function StudentEventsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [studentEvents, setStudentEvents] = useState<any>({ past: [], upcoming: [] })

  useEffect(() => {
    if (user) {
      // Get student events
      const events = getStudentEvents(user.id)
      if (events) {
        setStudentEvents(events)
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

  // Handle event registration
  const handleRegister = (eventId: number) => {
    if (!user) {
      toast({
        title: "Registration failed",
        description: "You need to be logged in to register for events",
        variant: "destructive",
      })
      return
    }

    const result = registerForEvent(eventId, user.id)

    if (result.success) {
      // Update local state to reflect registration
      setStudentEvents({
        ...studentEvents,
        upcoming: studentEvents.upcoming.map((event: any) =>
          event.id === eventId ? { ...event, registered: true } : event,
        ),
      })

      toast({
        title: "Registration successful",
        description: "You have successfully registered for this event",
      })
    } else {
      toast({
        title: "Registration failed",
        description: result.message || "Failed to register for this event",
        variant: "destructive",
      })
    }
  }

  // Handle view certificate
  const handleViewCertificate = (eventId: number) => {
    toast({
      title: "Certificate",
      description: "Certificate viewing is not implemented in the demo version.",
    })
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">My Events</h1>
        </div>

        <Tabs defaultValue="past" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          </TabsList>

          <TabsContent value="past" className="mt-6">
            {studentEvents.past.length > 0 ? (
              <div className="grid gap-6">
                {studentEvents.past.map((event: any) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>{event.organizer}</CardDescription>
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
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Points Earned</div>
                            <div className="text-2xl font-bold">{event.points}</div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleViewCertificate(event.id)}>
                            View Certificate
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
                <p>You haven't participated in any events yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-6">
            {studentEvents.upcoming.length > 0 ? (
              <div className="grid gap-6">
                {studentEvents.upcoming.map((event: any) => (
                  <Card key={event.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{event.title}</CardTitle>
                          <CardDescription>{event.organizer}</CardDescription>
                        </div>
                        <Badge variant="outline">{event.points} pts</Badge>
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
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          {event.registered ? (
                            <>
                              <Badge className="bg-green-500">Registered</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: event.title,
                                    description: event.description,
                                  })
                                }}
                              >
                                View Details
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">Registration Open</div>
                              </div>
                              <Button size="sm" onClick={() => handleRegister(event.id)}>
                                Register Now
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                <Calendar className="h-10 w-10 mb-2 opacity-20" />
                <p>No upcoming events available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

