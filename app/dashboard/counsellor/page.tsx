"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Search, FileText, Award, PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { getCounsellorById, getStudentsByCounsellor, getStudentById } from "@/lib/data"

export default function CounsellorDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [students, setStudents] = useState<any[]>([])
  const [counsellorData, setCounsellorData] = useState<any>(null)

  useEffect(() => {
    if (user) {
      // Get counsellor data
      const counsellor = getCounsellorById(user.id)
      setCounsellorData(counsellor)

      // Get assigned students
      const assignedStudents = getStudentsByCounsellor(user.id)
      setStudents(assignedStudents)
    }
  }, [user])

  // Filter students by search query
  const filteredStudents = searchQuery
    ? students.filter((student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students

  const handleSearch = () => {
    // Already filtered in the filteredStudents const
  }

  const handleAddCertificate = (studentId: string) => {
    router.push(`/dashboard/counsellor/student/${studentId}/add-certificate`)
  }

  const handleViewStudent = (studentId: string) => {
    router.push(`/dashboard/counsellor/student/${studentId}`)
  }

  if (!counsellorData) {
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
        {/* Counsellor Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Counsellor Dashboard</h2>
            <p className="text-muted-foreground">
              Manage your assigned students and their activity points
            </p>
          </div>
        </div>

        {/* Counsellor Info */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/50">
          <CardHeader className="pb-3">
            <CardTitle>Welcome, {counsellorData.name}</CardTitle>
            <CardDescription>
              Department of {counsellorData.department}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="font-medium">You have {students.length} students assigned to you.</p>
              <p className="mt-1 text-muted-foreground">
                You can view student details, approve certificates, and manage their activity points from here.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students by name, ID, or department..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch()
                }
              }}
            />
          </div>
          <Button
            onClick={() => {
              toast({
                title: "Generate Reports",
                description: "This feature is not implemented in the demo version.",
              })
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Generate Reports
          </Button>
        </div>

        {/* Student List */}
        <Card>
          <CardHeader>
            <CardTitle>Assigned Students</CardTitle>
            <CardDescription>View and manage your assigned students</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All Students</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="certificates">Pending Certificates</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                {filteredStudents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {student.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                            <div className="mt-1 flex items-center">
                              <GraduationCap className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{student.department}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={student.totalPoints >= 100 ? "bg-green-500" : "bg-amber-500"}>
                            {student.totalPoints} / {student.targetPoints} Points
                          </Badge>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewStudent(student.id)}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAddCertificate(student.id)}
                            >
                              <PlusCircle className="mr-1 h-3 w-3" />
                              Add Certificate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <GraduationCap className="h-10 w-10 mb-2 opacity-20" />
                    <p>No students found matching your search</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="active" className="mt-4">
                {filteredStudents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {student.name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                            <div className="mt-1 flex items-center">
                              <GraduationCap className="mr-1 h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{student.department}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={student.totalPoints >= 100 ? "bg-green-500" : "bg-amber-500"}>
                            {student.totalPoints} / {student.targetPoints} Points
                          </Badge>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewStudent(student.id)}
                            >
                              View Details
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleAddCertificate(student.id)}
                            >
                              <PlusCircle className="mr-1 h-3 w-3" />
                              Add Certificate
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <GraduationCap className="h-10 w-10 mb-2 opacity-20" />
                    <p>No active students found</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="certificates" className="mt-4">
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Award className="h-10 w-10 mb-2 opacity-20" />
                  <p>No pending certificates at the moment</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 