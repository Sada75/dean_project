"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Form states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  
  // Student specific fields
  const [usn, setUsn] = useState("")
  const [branch, setBranch] = useState("")
  const [year, setYear] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [selectedCounsellor, setSelectedCounsellor] = useState("")
  const [selectedClubs, setSelectedClubs] = useState<string[]>([])
  
  // Data for dropdowns
  const [counsellors, setCounsellors] = useState<{id: string, name: string}[]>([])
  const [clubs, setClubs] = useState<{id: string, name: string}[]>([])
  
  // Club specific fields
  const [clubName, setClubName] = useState("")
  const [clubType, setClubType] = useState("")
  
  // Admin specific fields
  const [adminType, setAdminType] = useState("")
  
  // Counsellor specific fields
  const [department, setDepartment] = useState("")

  useEffect(() => {
    if (!role || !['student', 'club', 'admin', 'counsellor'].includes(role)) {
      router.push('/login')
    }
  }, [role, router])

  // Fetch counsellors and clubs data for student registration
  useEffect(() => {
    if (role === 'student') {
      // Fetch teacher counsellors (admins with role 'teacher')
      fetch('/api/admin/teachers')
        .then(res => res.json())
        .then(data => {
          if (data.teachers) {
            setCounsellors(data.teachers.map((t: any) => ({ 
              id: t._id, 
              name: t.name,
              branch: t.branch
            })))
          }
        })
        .catch(err => console.error('Error fetching teacher counsellors:', err))

      // Fetch clubs from public endpoint
      fetch('/api/clubs/list')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.clubs) {
            setClubs(data.clubs)
          }
        })
        .catch(err => console.error('Error fetching clubs:', err))
    }
  }, [role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Additional validation for student registration
    if (role === 'student' && !selectedCounsellor) {
      // setError("Please select a counsellor")
      // setIsLoading(false)
      
    }

    // Prepare user data based on role
    let userData: any = {
      email,
      password,
      name,
      role
    }

    switch (role) {
      case 'student':
        if (!usn || !branch || !year || !graduationYear) {
          setError("All fields are required for student registration")
          setIsLoading(false)
          return
        }
        userData = { ...userData, usn, branch, year, graduationYear, selectedCounsellor, selectedClubs }
        break
      case 'club':
        if (!clubName || !clubType) {
          setError("All fields are required for club registration ")
          setIsLoading(false)
          return
        }
        userData = { ...userData, clubName, clubType }
        break
      case 'admin':
        if (!adminType) {
          setError("Admin type is required")
          setIsLoading(false)
          return
        }
        userData = { ...userData, adminType }
        break
      case 'counsellor':
        if (!department) {
          setError("Department is required")
          setIsLoading(false)
          return
        }
        userData = { ...userData, department }
        break
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess("Registration successful! Redirecting to login...")
        setTimeout(() => {
          router.push(`/login?role=${role}`)
        }, 2000)
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleTitle = () => {
    switch (role) {
      case 'student': return 'Student Registration'
      case 'club': return 'Club Registration'
      case 'admin': return 'Admin Registration'
      case 'counsellor': return 'Counsellor Registration'
      default: return 'Registration'
    }
  }

  const getRoleDescription = () => {
    switch (role) {
      case 'student': return 'Create your student account to participate in events and track your activity points.'
      case 'club': return 'Register your club to create and manage events for students.'
      case 'admin': return 'Create an admin account to oversee the activity points management system.'
      case 'counsellor': return 'Register as a counsellor to verify student activities and manage points.'
      default: return 'Create your account'
    }
  }

  if (!role) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/login?role=${role}`)}
              className="p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Image
                src="/rvce-logo.png"
                alt="RVCE Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <div>
                <h1 className="text-lg font-semibold">RVCE</h1>
                <p className="text-xs text-muted-foreground">Activity Points</p>
              </div>
            </div>
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl">{getRoleTitle()}</CardTitle>
            <CardDescription>{getRoleDescription()}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Role-specific Fields */}
            {role === 'student' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="usn">USN</Label>
                  <Input
                    id="usn"
                    type="text"
                    placeholder="e.g., 1RV20CS001"
                    value={usn}
                    onChange={(e) => setUsn(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Select value={branch} onValueChange={setBranch} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                      <SelectItem value="ECE">Electronics & Communication</SelectItem>
                      <SelectItem value="MECH">Mechanical Engineering</SelectItem>
                      <SelectItem value="CIVIL">Civil Engineering</SelectItem>
                      <SelectItem value="ISE">Information Science</SelectItem>
                      <SelectItem value="AI&ML">Artificial Intelligence & ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Current Year</Label>
                  <Select value={year} onValueChange={setYear} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Select value={graduationYear} onValueChange={setGraduationYear} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                      <SelectItem value="2027">2027</SelectItem>
                      <SelectItem value="2028">2028</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* <div className="space-y-2">
                  <Label htmlFor="counsellor">Counsellor</Label>
                  <Select value={selectedCounsellor} onValueChange={setSelectedCounsellor} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your counsellor" />
                    </SelectTrigger>
                    <SelectContent>
                      {counsellors.map((counsellor) => (
                        <SelectItem key={counsellor.id} value={counsellor.id}>
                          {counsellor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div> */}
                
                {/* <div className="space-y-2">
                  <Label htmlFor="clubs">Clubs (Optional)</Label>
                  <Select 
                    onValueChange={(value) => {
                      if (value && !selectedClubs.includes(value)) {
                        setSelectedClubs([...selectedClubs, value])
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select clubs you want to join" />
                    </SelectTrigger>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club.id} value={club.id}>
                          {club.name}
                        </SelectItem>
                      ))}
                      
                    </SelectContent>
                  </Select>
                  {selectedClubs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedClubs.map((clubId) => {
                        const club = clubs.find(c => c.id === clubId)
                        return club ? (
                          <span key={clubId} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center gap-1">
                            {club.name}
                            <button
                              type="button"
                              onClick={() => setSelectedClubs(selectedClubs.filter(id => id !== clubId))}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                </div> */}
              </>
            )}

            {role === 'club' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clubName">Club Name</Label>
                  <Input
                    id="clubName"
                    type="text"
                    placeholder="Enter club name"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubType">Club Type</Label>
                  <Select value={clubType} onValueChange={setClubType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select club type" />
                    </SelectTrigger>
                    <SelectContent>
                      
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {role === 'admin' && (
              <div className="space-y-2">
                <Label htmlFor="adminType">Admin Type</Label>
                <Select value={adminType} onValueChange={setAdminType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dean">Dean Student Affairs</SelectItem>
                    <SelectItem value="hod">Head of Department</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {role === 'counsellor' && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">Computer Science Engineering</SelectItem>
                    <SelectItem value="ECE">Electronics & Communication</SelectItem>
                    <SelectItem value="MECH">Mechanical Engineering</SelectItem>
                    <SelectItem value="CIVIL">Civil Engineering</SelectItem>
                    <SelectItem value="ISE">Information Science</SelectItem>
                    <SelectItem value="AI&ML">Artificial Intelligence & ML</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto"
              onClick={() => router.push(`/login?role=${role}`)}
            >
              Sign in
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 