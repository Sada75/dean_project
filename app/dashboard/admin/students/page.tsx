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
import { Download, FileText, MoreHorizontal, Search } from "lucide-react"
import { students } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function AdminStudentsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter students based on search term
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle view student details
  const handleViewStudent = (student: any) => {
    toast({
      title: student.name,
      description: `ID: ${student.id}, Department: ${student.department}, Semester: ${student.semester}`,
    })
  }

  // Handle view student points
  const handleViewPoints = (student: any) => {
    toast({
      title: "Points Breakdown",
      description: `Technical: ${student.pointsBreakdown.technical}, Cultural: ${student.pointsBreakdown.cultural}, Sports: ${student.pointsBreakdown.sports}, Social: ${student.pointsBreakdown.social}`,
    })
  }

  // Handle generate report
  const handleGenerateReport = (student: any) => {
    toast({
      title: "Generate Report",
      description: "This feature is not implemented in the demo version.",
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Students Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Students</CardTitle>
            <CardDescription>View and manage all registered students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "Export Students",
                      description: "This feature is not implemented in the demo version.",
                    })
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Students
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Semester</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell>{student.semester}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {student.totalPoints} / {student.targetPoints}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={student.totalPoints >= student.targetPoints ? "default" : "secondary"}
                              className={student.totalPoints >= student.targetPoints ? "bg-green-500" : ""}
                            >
                              {student.totalPoints >= student.targetPoints ? "Completed" : "In Progress"}
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
                                <DropdownMenuItem onClick={() => handleViewStudent(student)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewPoints(student)}>
                                  View Points Breakdown
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleGenerateReport(student)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Generate Report
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No students found
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

