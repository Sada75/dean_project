"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CalendarIcon, Award, GraduationCap, User, PlusCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getStudentById } from "@/lib/data"

export default function StudentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [studentData, setStudentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [verifyingCertificateId, setVerifyingCertificateId] = useState<string | null>(null)

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

  const handleAddCertificate = () => {
    router.push(`/dashboard/counsellor/student/${params.id}/add-certificate`)
  }

  // Handle certificate verification
  const handleVerifyCertificate = (certificateId: string) => {
    setVerifyingCertificateId(certificateId)
    
    // Find the certificate
    const certificate = studentData.certificates.find((cert: any) => cert.id === certificateId)
    if (!certificate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Certificate not found",
      })
      setVerifyingCertificateId(null)
      return
    }
    
    // Update the certificate
    certificate.verified = true
    
    // Update student points
    studentData.totalPoints += certificate.points
    studentData.pointsBreakdown[certificate.category] += certificate.points
    
    // Show success message
    toast({
      title: "Certificate verified",
      description: "The certificate has been successfully verified and points have been added to the student's account",
    })
    
    // Update state
    setStudentData({...studentData})
    setVerifyingCertificateId(null)
  }

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
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
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="gap-1" onClick={() => router.push("/dashboard/counsellor")}>
            <ArrowLeft className="h-4 w-4" />
            Back to Students
          </Button>
          <Button onClick={handleAddCertificate}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Certificate
          </Button>
        </div>

        {/* Student Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg bg-primary/10 text-primary">
                    {studentData.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{studentData.name}</CardTitle>
                  <CardDescription>{studentData.id}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-1">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Student</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{studentData.department}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Semester {studentData.semester}</span>
              </div>
            </CardContent>
          </Card>

          {/* Activity Points Summary */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activity Points Summary</CardTitle>
              <CardDescription>
                Progress towards the required minimum of 100 activity points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Total Points: {studentData.totalPoints} / {studentData.targetPoints}
                  </span>
                  <Badge className={studentData.totalPoints >= 100 ? "bg-green-500" : "bg-amber-500"}>
                    {studentData.totalPoints >= 100 ? "Requirement Met" : "In Progress"}
                  </Badge>
                </div>
                <Progress 
                  value={(studentData.totalPoints / studentData.targetPoints) * 100}
                  className="h-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Technical</span>
                    <span className="font-medium text-sm">{studentData.pointsBreakdown.technical} pts</span>
                  </div>
                  <Progress 
                    value={(studentData.pointsBreakdown.technical / studentData.totalPoints) * 100}
                    className="h-1.5 bg-blue-100 dark:bg-blue-950"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cultural</span>
                    <span className="font-medium text-sm">{studentData.pointsBreakdown.cultural} pts</span>
                  </div>
                  <Progress 
                    value={(studentData.pointsBreakdown.cultural / studentData.totalPoints) * 100}
                    className="h-1.5 bg-purple-100 dark:bg-purple-950"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Sports</span>
                    <span className="font-medium text-sm">{studentData.pointsBreakdown.sports} pts</span>
                  </div>
                  <Progress 
                    value={(studentData.pointsBreakdown.sports / studentData.totalPoints) * 100}
                    className="h-1.5 bg-green-100 dark:bg-green-950"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Social</span>
                    <span className="font-medium text-sm">{studentData.pointsBreakdown.social} pts</span>
                  </div>
                  <Progress 
                    value={(studentData.pointsBreakdown.social / studentData.totalPoints) * 100}
                    className="h-1.5 bg-amber-100 dark:bg-amber-950"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Certificates and Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Certificates & Activities</CardTitle>
            <CardDescription>Student's participation certificates and achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="certificates" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="certificates">Certificates</TabsTrigger>
                <TabsTrigger value="events">Event Participation</TabsTrigger>
              </TabsList>
              <TabsContent value="certificates" className="mt-4">
                {studentData.certificates && studentData.certificates.length > 0 ? (
                  <div className="space-y-4">
                    {studentData.certificates.map((certificate: any) => (
                      <Card key={certificate.id} className="overflow-hidden">
                        <div className={`h-1.5 w-full ${
                          certificate.category === 'technical' ? 'bg-blue-500' :
                          certificate.category === 'cultural' ? 'bg-purple-500' :
                          certificate.category === 'sports' ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">{certificate.title}</CardTitle>
                              <CardDescription>Issued by: {certificate.issuer}</CardDescription>
                            </div>
                            <Badge variant={certificate.verified ? "default" : "outline"}>
                              {certificate.verified ? "Verified" : "Pending"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2 pt-0">
                          <div className="text-sm text-muted-foreground flex items-center">
                            <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                            {formatDate(certificate.date)}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Badge variant="outline" className="font-mono">
                            <Award className="h-3.5 w-3.5 mr-1.5" />
                            {certificate.points} points
                          </Badge>
                          {!certificate.verified && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleVerifyCertificate(certificate.id)}
                              disabled={verifyingCertificateId === certificate.id}
                            >
                              {verifyingCertificateId === certificate.id ? (
                                <>Verifying...</>
                              ) : (
                                <>Verify Certificate</>
                              )}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Award className="h-12 w-12 mb-3 opacity-20" />
                    <p>No certificates uploaded yet</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={handleAddCertificate}
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Certificate
                    </Button>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="events" className="mt-4">
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mb-3 opacity-20" />
                  <p>Event participation data not available</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 