"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, ArrowRight } from "lucide-react"
import { upcomingEvents, registerForEvent } from "@/lib/data"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Extend the event type with additional properties for UI
interface ExtendedEvent {
  id: number;
  title: string;
  organizer: string;
  organizerId: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  points: number;
  status: string;
  registrationLink: string;
  registeredStudents: string[];
  category?: string;
  maxParticipants?: number;
}

export function UpcomingEvents() {
  const { user, role } = useAuth()
  const { toast } = useToast()
  
  // Add UI-specific properties to the events
  const [events, setEvents] = useState<ExtendedEvent[]>(
    upcomingEvents.map(event => ({
      ...event,
      // Add default category based on organizer for display purposes
      category: event.organizer.includes('IEEE') || event.organizer.includes('CSE') 
        ? 'technical' 
        : event.organizer.includes('Cultural') 
          ? 'cultural'
          : event.organizer.includes('Sports')
            ? 'sports'
            : 'social',
      // Add maxParticipants for UI display
      maxParticipants: event.organizer.includes('IEEE') ? 50 : event.organizer.includes('CSE') ? 100 : 30
    }))
  )

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

  // Get event type color
  const getEventTypeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'technical':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'cultural':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'sports':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'social':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold font-heading">Upcoming Events</h2>
        <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1 px-2">
          View All <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {events.map((event) => (
          <Card 
            key={event.id} 
            className="overflow-hidden transition-all hover:shadow-md border border-border/50 group"
          >
            <div className={cn("h-1.5 w-full", getEventTypeColor(event.category || 'default'))} />
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-base md:text-lg font-heading">
                  {event.title}
                </CardTitle>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs font-medium border", getEventTypeColor(event.category || 'default'))}
                >
                  {event.points} pts
                </Badge>
              </div>
              <CardDescription className="text-xs sm:text-sm mt-1 flex items-center gap-1">
                <span className="font-medium text-foreground/70">{event.organizer}</span>
                <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">{event.category || 'Event'}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-primary/70" />
                  <span className="font-medium">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-primary/70" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <span className="truncate" title={event.venue}>{event.venue}</span>
                </div>
                {event.maxParticipants && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary/70" />
                    <span>{event.registeredStudents.length}/{event.maxParticipants} registered</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              {role === "student" &&
                (isRegistered(event.id) ? (
                  <Button size="sm" className="w-full" variant="outline" disabled>
                    Registered
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    className="w-full transition-all bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group-hover:shadow-md" 
                    onClick={() => handleRegister(event.id)}
                  >
                    Register Now
                  </Button>
                ))}
              {role !== "student" && (
                <Button
                  size="sm"
                  className="w-full"
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
            </CardFooter>
          </Card>
        ))}
      </div>
      <Button
        variant="outline"
        className="w-full bg-muted/50 hover:bg-muted font-medium"
        onClick={() => {
          toast({
            title: "All events",
            description: "Viewing all upcoming events is not implemented in this demo",
          })
        }}
      >
        Explore All Events
      </Button>
    </div>
  )
}

