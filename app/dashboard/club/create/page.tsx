"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/date-picker"
import { Calendar, Clock, MapPin, Upload, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { createEvent } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function CreateEventPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [eventDate, setEventDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    time: "",
    venue: "",
    points: "",
    registrationLink: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id.replace("event-", "")]: value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!eventDate) {
      toast({
        title: "Missing date",
        description: "Please select an event date",
        variant: "destructive",
      })
      return
    }

    if (
      !formData.title ||
      !formData.category ||
      !formData.description ||
      !formData.time ||
      !formData.venue ||
      !formData.points
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Prepare event data
    const eventData = {
      title: formData.title,
      organizer: user?.name,
      organizerId: user?.id,
      description: formData.description,
      date: eventDate.toISOString().split("T")[0],
      time: formData.time,
      venue: formData.venue,
      points: Number.parseInt(formData.points),
      registrationLink: formData.registrationLink || "https://forms.example.com/register",
    }

    // Create event
    const result = createEvent(eventData)

    if (result.success) {
      toast({
        title: "Event created",
        description: "Your event has been created successfully",
      })

      // Redirect to club dashboard
      setTimeout(() => {
        router.push("/dashboard/club")
      }, 1500)
    } else {
      toast({
        title: "Failed to create event",
        description: "There was an error creating your event",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout role="club">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Create New Event</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Fill in the details for your new event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-category">Event Category</Label>
                  <Select value={formData.category} onValueChange={handleSelectChange}>
                    <SelectTrigger id="event-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="social">Social Service</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Event Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Provide a detailed description of the event"
                  className="min-h-32"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Event Date</Label>
                  <div className="flex items-center border rounded-md">
                    <span className="pl-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <DatePicker
                      date={eventDate}
                      setDate={setEventDate}
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-time">Event Time</Label>
                  <div className="flex items-center border rounded-md">
                    <span className="pl-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <Input
                      id="event-time"
                      placeholder="e.g. 10:00 AM - 1:00 PM"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-venue">Event Venue</Label>
                  <div className="flex items-center border rounded-md">
                    <span className="pl-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </span>
                    <Input
                      id="event-venue"
                      placeholder="Enter venue"
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={formData.venue}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event-points">Activity Points</Label>
                  <Input
                    id="event-points"
                    type="number"
                    placeholder="Points awarded for participation"
                    min="0"
                    max="50"
                    value={formData.points}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-registrationLink">Registration Link (Optional)</Label>
                <Input
                  id="event-registrationLink"
                  placeholder="https://forms.example.com/register"
                  value={formData.registrationLink}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Event Poster (Optional)</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="poster-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                    </div>
                    <input id="poster-upload" type="file" className="hidden" />
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/club")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

