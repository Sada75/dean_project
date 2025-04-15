"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar, Award, Upload, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStudentById, addCertificateForStudent } from "@/lib/data"

export default function AddCertificatePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [studentData, setStudentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Certificate form data
  const [certificateData, setCertificateData] = useState({
    title: "",
    issuer: "",
    date: new Date().toISOString().split("T")[0], // Format as YYYY-MM-DD
    points: 0,
    category: "technical" as "technical" | "cultural" | "sports" | "social",
    verified: true
  })

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCertificateData({
      ...certificateData,
      [name]: name === "points" ? parseInt(value) || 0 : value
    })
  }

  // Handle select changes
  const handleSelectChange = (value: string, name: string) => {
    setCertificateData({
      ...certificateData,
      [name]: value
    })
  }

  // Handle switch changes
  const handleSwitchChange = (checked: boolean) => {
    setCertificateData({
      ...certificateData,
      verified: checked
    })
  }

  useEffect(() => {
    const fetchStudentData = () => {
      setIsLoading(true)
      // Get student data
      const data = getStudentById(params.id)
      if (data) {
        setStudentData(data)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Student not found",
        })
        router.push("/dashboard/counsellor")
      }
      setIsLoading(false)
    }

    fetchStudentData()
  }, [params.id, router, toast])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate form
      if (!certificateData.title.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Certificate title is required",
        })
        setIsSaving(false)
        return
      }

      if (!certificateData.issuer.trim()) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Certificate issuer is required",
        })
        setIsSaving(false)
        return
      }

      if (certificateData.points <= 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Points must be greater than 0",
        })
        setIsSaving(false)
        return
      }

      // Add certificate
      const result = addCertificateForStudent(params.id, certificateData)

      if (result.success) {
        toast({
          title: "Success",
          description: "Certificate added successfully",
        })
        router.push(`/dashboard/counsellor/student/${params.id}`)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to add certificate",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading || !studentData) {
    return (
      <DashboardLayout role="admin">
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
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Back button and title */}
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="gap-1" 
            onClick={() => router.push(`/dashboard/counsellor/student/${params.id}`)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Student
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Add Certificate</h2>
            <p className="text-muted-foreground">
              Add a new certificate for {studentData.name}
            </p>
          </div>
        </div>

        {/* Certificate Form */}
        <Card>
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
            <CardDescription>
              Enter the details of the certificate or achievement
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., First Prize in Hackathon"
                    value={certificateData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuer">Issuing Organization</Label>
                  <Input
                    id="issuer"
                    name="issuer"
                    placeholder="e.g., IEEE, Microsoft"
                    value={certificateData.issuer}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Achievement</Label>
                    <div className="relative">
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={certificateData.date}
                        onChange={handleInputChange}
                        required
                      />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Activity Points</Label>
                    <div className="relative">
                      <Input
                        id="points"
                        name="points"
                        type="number"
                        min="1"
                        max="50"
                        placeholder="Points value"
                        value={certificateData.points === 0 ? "" : certificateData.points}
                        onChange={handleInputChange}
                        required
                      />
                      <Award className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    defaultValue={certificateData.category}
                    onValueChange={(value) => handleSelectChange(value, "category")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="cultural">Cultural</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between space-x-2 pt-2">
                  <Label htmlFor="verified" className="flex flex-col space-y-1">
                    <span>Verify Certificate</span>
                    <span className="font-normal text-sm text-muted-foreground">
                      Points will be immediately added to student's account
                    </span>
                  </Label>
                  <Switch
                    id="verified"
                    checked={certificateData.verified}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="file" className="block">Certificate File (Optional)</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">Max file size: 5MB</p>
                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => document.getElementById("file")?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/dashboard/counsellor/student/${params.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Save Certificate
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
} 