"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload } from "lucide-react"

export default function ClubSettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    description: user?.description || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [notifications, setNotifications] = useState({
    email: true,
    events: true,
    verifications: true,
    reminders: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications({
      ...notifications,
      [key]: checked,
    })
  }

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      toast({
        title: "Profile updated",
        description: "Your club profile has been updated successfully",
      })
    }, 1000)
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false)
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully",
      })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated",
    })
  }

  return (
    <DashboardLayout role="club">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Club Settings</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Club Profile</CardTitle>
                <CardDescription>Update your club information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Club Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Club Description</Label>
                  <Textarea id="description" value={formData.description} onChange={handleInputChange} rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Club ID</Label>
                  <Input value={user?.id || ""} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Club ID cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label>Club Logo (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="logo-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                      </div>
                      <input id="logo-upload" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Password Settings */}
          <Card>
            <form onSubmit={handleUpdatePassword}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" value={formData.newPassword} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications about your club account</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => handleNotificationChange("email", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified about changes to events you've organized</p>
              </div>
              <Switch
                checked={notifications.events}
                onCheckedChange={(checked) => handleNotificationChange("events", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Verification Updates</Label>
                <p className="text-sm text-muted-foreground">Receive notifications when your events are verified</p>
              </div>
              <Switch
                checked={notifications.verifications}
                onCheckedChange={(checked) => handleNotificationChange("verifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Event Reminders</Label>
                <p className="text-sm text-muted-foreground">Get reminders before events you've organized</p>
              </div>
              <Switch
                checked={notifications.reminders}
                onCheckedChange={(checked) => handleNotificationChange("reminders", checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveNotifications}>Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

