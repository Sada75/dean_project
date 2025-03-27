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
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [systemSettings, setSystemSettings] = useState({
    autoVerify: false,
    emailNotifications: true,
    allowStudentRegistration: true,
    allowClubRegistration: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value,
    })
  }

  const handleSystemSettingChange = (key: string, checked: boolean) => {
    setSystemSettings({
      ...systemSettings,
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
        description: "Your admin profile has been updated successfully",
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

  const handleSaveSystemSettings = () => {
    toast({
      title: "System settings saved",
      description: "Your system settings have been updated",
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={formData.role} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label>Admin ID</Label>
                  <Input value={user?.id || ""} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Admin ID cannot be changed</p>
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

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>Configure global system settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Verify Events</Label>
                <p className="text-sm text-muted-foreground">Automatically verify events created by trusted clubs</p>
              </div>
              <Switch
                checked={systemSettings.autoVerify}
                onCheckedChange={(checked) => handleSystemSettingChange("autoVerify", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email notifications for important system events</p>
              </div>
              <Switch
                checked={systemSettings.emailNotifications}
                onCheckedChange={(checked) => handleSystemSettingChange("emailNotifications", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Student Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new students to register on the platform</p>
              </div>
              <Switch
                checked={systemSettings.allowStudentRegistration}
                onCheckedChange={(checked) => handleSystemSettingChange("allowStudentRegistration", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow Club Registration</Label>
                <p className="text-sm text-muted-foreground">Allow new clubs to register on the platform</p>
              </div>
              <Switch
                checked={systemSettings.allowClubRegistration}
                onCheckedChange={(checked) => handleSystemSettingChange("allowClubRegistration", checked)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveSystemSettings}>Save System Settings</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  )
}

