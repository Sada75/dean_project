"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { getApiEndpoints } from "@/lib/api-utils"

export default function AdminApiPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const endpoints = getApiEndpoints()

  // Filter endpoints based on search term
  const filteredEndpoints = endpoints.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endpoint.method.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">API Documentation</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available API Endpoints</CardTitle>
            <CardDescription>Documentation for all available API endpoints in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="relative sm:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search endpoints..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Path</TableHead>
                      <TableHead>Authentication</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEndpoints.length > 0 ? (
                      filteredEndpoints.map((endpoint, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{endpoint.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                endpoint.method === "GET"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : endpoint.method === "POST"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : endpoint.method === "PUT"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : "bg-red-500/10 text-red-500 border-red-500/20"
                              }
                            >
                              {endpoint.method}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs sm:text-sm">{endpoint.path}</TableCell>
                          <TableCell>
                            {endpoint.requiresAuth ? (
                              <Badge
                                variant="outline"
                                className="bg-purple-500/10 text-purple-500 border-purple-500/20"
                              >
                                Required
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                                Not Required
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No endpoints found
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

