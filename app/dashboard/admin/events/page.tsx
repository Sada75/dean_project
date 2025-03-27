"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Check, Download, MoreHorizontal, Search, X } from "lucide-react"
import { events, verifyEvent } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [eventsData, setEventsData] = useState(events)

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Filter events based on search term and status filter
  const filteredEvents = eventsData.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? event.status === statusFilter : true

    return matchesSearch && matchesStatus
  })

  // Handle event verification
  const handleVerifyEvent = (eventId: number) => {
    const result = verifyEvent(eventId)

    if (result.success) {
      // Update local state to reflect verification
      setEventsData(eventsData.map((event) => (event.id === eventId ? { ...event, status: "verified" } : event)))

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

  // Handle event rejection
  const handleRejectEvent = (eventId: number) => {
    toast({
      title: "Event rejected",
      description: "This feature is not fully implemented in the demo version.",
    })
  }

  // Handle view details
  const handleViewDetails = (event: any) => {
    toast({
      title: event.title,
      description: event.description,
    })
  }

  // Handle view participants
  const handleViewParticipants = (event: any) => {
    toast({
      title: `Participants for ${event.title}`,
      description: `This event has ${event.participants} participants.`,
    })
  }

  // Handle export participants
  const handleExportParticipants = (event: any) => {
    toast({
      title: "Export participants",
      description: "This feature is not implemented in the demo version.",
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Events Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>View and manage all events across clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={statusFilter === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(null)}
                  >
                    All
                  </Button>
                  <Button
                    variant={statusFilter === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={statusFilter === "verified" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter("verified")}
                  >
                    Verified
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Participants</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{event.organizer}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {formatDate(event.date)}
                            </div>
                          </TableCell>
                          <TableCell>{event.participants}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.points} pts</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={event.status === "verified" ? "default" : "secondary"}
                              className={event.status === "verified" ? "bg-green-500" : ""}
                            >
                              {event.status === "verified" ? "Verified" : "Pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewDetails(event)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewParticipants(event)}>
                                  View Participants
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {event.status === "pending" ? (
                                  <>
                                    <DropdownMenuItem onClick={() => handleVerifyEvent(event.id)}>
                                      <Check className="mr-2 h-4 w-4 text-green-500" />
                                      Verify Event
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRejectEvent(event.id)}>
                                      <X className="mr-2 h-4 w-4 text-red-500" />
                                      Reject Event
                                    </DropdownMenuItem>
                                  </>
                                ) : (
                                  <DropdownMenuItem onClick={() => handleExportParticipants(event)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Export Participants
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No events found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

