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
import { clubs } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function AdminClubsPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")

  // Filter clubs based on search term
  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle view club details
  const handleViewClub = (club: any) => {
    toast({
      title: club.name,
      description: club.description,
    })
  }

  // Handle view club events
  const handleViewEvents = (club: any) => {
    toast({
      title: "Club Events",
      description: `Total Events: ${club.totalEvents}, Pending: ${club.pendingVerification}, Upcoming: ${club.upcomingEvents}`,
    })
  }

  // Handle generate report
  const handleGenerateReport = (club: any) => {
    toast({
      title: "Generate Report",
      description: "This feature is not implemented in the demo version.",
    })
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Clubs Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Clubs</CardTitle>
            <CardDescription>View and manage all registered clubs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative sm:w-96">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search clubs..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "Export Clubs",
                      description: "This feature is not implemented in the demo version.",
                    })
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export Clubs
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Club Name</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Total Events</TableHead>
                      <TableHead>Pending Events</TableHead>
                      <TableHead>Upcoming Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClubs.length > 0 ? (
                      filteredClubs.map((club) => (
                        <TableRow key={club.id}>
                          <TableCell className="font-medium">{club.name}</TableCell>
                          <TableCell>{club.id}</TableCell>
                          <TableCell>{club.totalEvents}</TableCell>
                          <TableCell>{club.pendingVerification}</TableCell>
                          <TableCell>{club.upcomingEvents}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500 text-white">
                              Active
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
                                <DropdownMenuItem onClick={() => handleViewClub(club)}>View Details</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewEvents(club)}>View Events</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleGenerateReport(club)}>
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
                          No clubs found
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

