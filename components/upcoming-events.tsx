"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { upcomingEvents, registerForEvent } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export function UpcomingEvents() {
  const { user, role } = useAuth()
  const { toast } = useToast()
  const [events, setEvents] = useState(upcomingEvents)

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Handle event registration
  const handleRegister = (eventId: number) => {
    if (role !== "student" || !user) {
      toast({
        title: "Registration failed",
        description: "You need to be logged in as a student to register for events",
        variant: "destructive",
      })
      return
    }

    const result = registerForEvent(eventId, user.id)

    if (result.success) {
      // Update local state to reflect registration
      setEvents(
        events.map((event) =>
          event.id === eventId
            ? {
                ...event,
                registeredStudents: [...event.registeredStudents, user.id],
              }
            : event,
        ),
      )

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

  // Check if student is registered for an event
  const isRegistered = (eventId: number) => {
    if (role !== "student" || !user) return false

    const event = events.find((e) => e.id === eventId)
    return event ? event.registeredStudents.includes(user.id) : false
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Upcoming Events</h2>
      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="p-3 pb-2 sm:p-4 sm:pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm sm:text-base">{event.title}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {event.points} pts
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm">{event.organizer}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.venue}</span>
                </div>
                {role === "student" &&
                  (isRegistered(event.id) ? (
                    <Button size="sm" className="w-full mt-2" variant="outline" disabled>
                      Registered
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full mt-2" onClick={() => handleRegister(event.id)}>
                      Register
                    </Button>
                  ))}
                {role !== "student" && (
                  <Button
                    size="sm"
                    className="w-full mt-2"
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Event details",
                        description: event.description,
                      })
                    }}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          toast({
            title: "All events",
            description: "Viewing all upcoming events is not implemented in this demo",
          })
        }}
      >
        View All Events
      </Button>
    </div>
  )
}

