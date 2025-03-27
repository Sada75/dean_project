// Mock data for the entire application

// Student data
export const students = [
  {
    id: "1RV20CS001",
    name: "Rahul Sharma",
    email: "rahul.s@rvce.edu.in",
    password: "password123", // In a real app, this would be hashed
    department: "Computer Science",
    semester: 5,
    totalPoints: 75,
    targetPoints: 100,
    pointsBreakdown: {
      technical: 35,
      cultural: 15,
      sports: 10,
      social: 15,
    },
  },
  {
    id: "1RV20EC045",
    name: "Priya Patel",
    email: "priya.p@rvce.edu.in",
    password: "password123",
    department: "Electronics",
    semester: 5,
    totalPoints: 60,
    targetPoints: 100,
    pointsBreakdown: {
      technical: 25,
      cultural: 20,
      sports: 5,
      social: 10,
    },
  },
  {
    id: "1RV20ME032",
    name: "Amit Kumar",
    email: "amit.k@rvce.edu.in",
    password: "password123",
    department: "Mechanical",
    semester: 5,
    totalPoints: 45,
    targetPoints: 100,
    pointsBreakdown: {
      technical: 15,
      cultural: 5,
      sports: 20,
      social: 5,
    },
  },
  {
    id: "1RV20CS078",
    name: "Sneha Reddy",
    email: "sneha.r@rvce.edu.in",
    password: "password123",
    department: "Computer Science",
    semester: 5,
    totalPoints: 85,
    targetPoints: 100,
    pointsBreakdown: {
      technical: 40,
      cultural: 25,
      sports: 10,
      social: 10,
    },
  },
]

// Club data
export const clubs = [
  {
    id: "CLB001",
    name: "IEEE Student Branch",
    email: "ieee@rvce.edu.in",
    password: "password123",
    description: "Technical club focused on engineering and technology",
    totalEvents: 12,
    pendingVerification: 3,
    upcomingEvents: 2,
  },
  {
    id: "CLB005",
    name: "Cultural Committee",
    email: "cultural@rvce.edu.in",
    password: "password123",
    description: "Organizing cultural events and activities",
    totalEvents: 8,
    pendingVerification: 1,
    upcomingEvents: 1,
  },
  {
    id: "CLB010",
    name: "Sports Club",
    email: "sports@rvce.edu.in",
    password: "password123",
    description: "Promoting sports and physical activities",
    totalEvents: 6,
    pendingVerification: 0,
    upcomingEvents: 1,
  },
  {
    id: "CLB015",
    name: "Coding Club",
    email: "coding@rvce.edu.in",
    password: "password123",
    description: "Enhancing coding skills and organizing competitions",
    totalEvents: 10,
    pendingVerification: 2,
    upcomingEvents: 1,
  },
]

// Admin data
export const admins = [
  {
    id: "ADM001",
    name: "Dr. Rajesh Kumar",
    email: "dean@rvce.edu.in",
    password: "password123",
    role: "Dean - Student Affairs",
  },
]

// Events data
export const events = [
  {
    id: 1,
    title: "Technical Paper Presentation",
    organizer: "IEEE Club",
    organizerId: "CLB001",
    description: "Present technical papers on emerging technologies and innovations.",
    date: "2023-10-15",
    time: "10:00 AM - 1:00 PM",
    venue: "Seminar Hall 1",
    points: 15,
    status: "pending",
    participants: 45,
    registrationLink: "https://forms.example.com/tech-paper",
    participantsList: ["1RV20CS001", "1RV20EC045"],
  },
  {
    id: 2,
    title: "Hackathon 2023",
    organizer: "CSE Department",
    organizerId: "CLB015",
    description: "24-hour coding competition to solve real-world problems.",
    date: "2023-10-05",
    time: "9:00 AM - 9:00 AM (Next day)",
    venue: "Computer Lab 3",
    points: 20,
    status: "verified",
    participants: 120,
    registrationLink: "https://forms.example.com/hackathon",
    participantsList: ["1RV20CS001", "1RV20CS078"],
  },
  {
    id: 3,
    title: "Workshop on AI",
    organizer: "IEEE Club",
    organizerId: "CLB001",
    description: "Learn about artificial intelligence and its applications.",
    date: "2023-09-25",
    time: "2:00 PM - 5:00 PM",
    venue: "Seminar Hall 2",
    points: 10,
    status: "pending",
    participants: 75,
    registrationLink: "https://forms.example.com/ai-workshop",
    participantsList: ["1RV20CS001", "1RV20CS078", "1RV20EC045"],
  },
  {
    id: 4,
    title: "Cultural Performance",
    organizer: "Cultural Committee",
    organizerId: "CLB005",
    description: "Showcase your talents in music, dance, and drama.",
    date: "2023-09-20",
    time: "5:00 PM - 8:00 PM",
    venue: "College Auditorium",
    points: 8,
    status: "verified",
    participants: 30,
    registrationLink: "https://forms.example.com/cultural",
    participantsList: ["1RV20EC045"],
  },
  {
    id: 5,
    title: "Sports Tournament",
    organizer: "Sports Club",
    organizerId: "CLB010",
    description: "Inter-department sports competition.",
    date: "2023-09-15",
    time: "9:00 AM - 5:00 PM",
    venue: "College Grounds",
    points: 12,
    status: "verified",
    participants: 50,
    registrationLink: "https://forms.example.com/sports",
    participantsList: ["1RV20ME032"],
  },
  {
    id: 6,
    title: "Debate Competition",
    organizer: "Literary Club",
    organizerId: "CLB005",
    description: "Showcase your debating skills on current topics.",
    date: "2023-09-10",
    time: "2:00 PM - 5:00 PM",
    venue: "Seminar Hall 3",
    points: 10,
    status: "verified",
    participants: 25,
    registrationLink: "https://forms.example.com/debate",
    participantsList: [],
  },
  {
    id: 7,
    title: "Photography Contest",
    organizer: "Photography Club",
    organizerId: "CLB005",
    description: "Capture the beauty of nature and campus life.",
    date: "2023-09-05",
    time: "All day",
    venue: "College Campus",
    points: 8,
    status: "verified",
    participants: 40,
    registrationLink: "https://forms.example.com/photography",
    participantsList: ["1RV20CS078"],
  },
  {
    id: 8,
    title: "Technical Quiz",
    organizer: "CSE Department",
    organizerId: "CLB015",
    description: "Test your technical knowledge across various domains.",
    date: "2023-08-25",
    time: "10:00 AM - 12:00 PM",
    venue: "Lecture Hall 5",
    points: 10,
    status: "verified",
    participants: 60,
    registrationLink: "https://forms.example.com/tech-quiz",
    participantsList: ["1RV20CS001", "1RV20CS078"],
  },
]

// Upcoming events
export const upcomingEvents = [
  {
    id: 9,
    title: "Technical Workshop",
    organizer: "IEEE Club",
    organizerId: "CLB001",
    description: "Hands-on workshop on emerging technologies.",
    date: "2023-11-15",
    time: "10:00 AM - 1:00 PM",
    venue: "Seminar Hall 1",
    points: 10,
    status: "upcoming",
    registrationLink: "https://forms.example.com/tech-workshop",
    registeredStudents: ["1RV20CS001"],
  },
  {
    id: 10,
    title: "Coding Competition",
    organizer: "CSE Department",
    organizerId: "CLB015",
    description: "Solve coding challenges and compete with peers.",
    date: "2023-11-18",
    time: "2:00 PM - 6:00 PM",
    venue: "Computer Lab 3",
    points: 15,
    status: "upcoming",
    registrationLink: "https://forms.example.com/coding-comp",
    registeredStudents: [],
  },
  {
    id: 11,
    title: "Cultural Fest",
    organizer: "Cultural Committee",
    organizerId: "CLB005",
    description: "Annual cultural festival with various performances.",
    date: "2023-11-25",
    time: "9:00 AM - 5:00 PM",
    venue: "College Auditorium",
    points: 20,
    status: "upcoming",
    registrationLink: "https://forms.example.com/cultural-fest",
    registeredStudents: [],
  },
]

// Function to get student events
export function getStudentEvents(studentId: string) {
  const pastEvents = events.filter((event) => event.participantsList.includes(studentId))

  const upcoming = upcomingEvents.map((event) => ({
    ...event,
    registered: event.registeredStudents.includes(studentId),
  }))

  return { past: pastEvents, upcoming }
}

// Function to get club events
export function getClubEvents(clubId: string) {
  const pastEvents = events.filter((event) => event.organizerId === clubId)
  const upcoming = upcomingEvents.filter((event) => event.organizerId === clubId)

  return { past: pastEvents, upcoming }
}

// Function to get student by ID
export function getStudentById(studentId: string) {
  return students.find((student) => student.id === studentId)
}

// Function to get club by ID
export function getClubById(clubId: string) {
  return clubs.find((club) => club.id === clubId)
}

// Function to authenticate user
export function authenticateUser(email: string, password: string, role: string) {
  if (role === "student") {
    const student = students.find((s) => s.email === email && s.password === password)
    if (student) return { success: true, user: student, role: "student" }
  } else if (role === "club") {
    const club = clubs.find((c) => c.email === email && c.password === password)
    if (club) return { success: true, user: club, role: "club" }
  } else if (role === "admin") {
    const admin = admins.find((a) => a.email === email && a.password === password)
    if (admin) return { success: true, user: admin, role: "admin" }
  }

  return { success: false, message: "Invalid credentials" }
}

// Function to register for an event
export function registerForEvent(eventId: number, studentId: string) {
  const eventIndex = upcomingEvents.findIndex((e) => e.id === eventId)
  if (eventIndex !== -1) {
    if (!upcomingEvents[eventIndex].registeredStudents.includes(studentId)) {
      upcomingEvents[eventIndex].registeredStudents.push(studentId)
    }
    return { success: true }
  }
  return { success: false, message: "Event not found" }
}

// Function to verify an event
export function verifyEvent(eventId: number) {
  const eventIndex = events.findIndex((e) => e.id === eventId)
  if (eventIndex !== -1) {
    events[eventIndex].status = "verified"
    return { success: true }
  }
  return { success: false, message: "Event not found" }
}

// Function to create a new event
export function createEvent(eventData: any) {
  const newEvent = {
    ...eventData,
    id: upcomingEvents.length + events.length + 1,
    status: "upcoming",
    registeredStudents: [],
  }

  upcomingEvents.push(newEvent)
  return { success: true, event: newEvent }
}

