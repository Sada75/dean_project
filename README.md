# College Points Management System

A complete system for managing college activity points, events, and student records.

## Features

- Multi-role authentication (Admin, Counsellor, Club, Student)
- Event management with approval workflow
- Student participation tracking and verification
- Activity points accumulation and categorization
- Responsive dashboard for all user types

## API Structure

### Authentication

- `POST /api/auth/login` - Login for all user types
- `POST /api/auth/register` - Register new student accounts

### Public Endpoints

- `GET /api/events` - List all events with filtering and pagination
- `GET /api/events/:id` - Get detailed information about a specific event

### Student Endpoints

- `POST /api/student/events/:id/register` - Register for an event
- `GET /api/student/profile` - Get student profile with participation history

### Club Endpoints

- `POST /api/club/events` - Create new event (pending admin approval)
- `PUT /api/club/events/:id` - Update event details
- `GET /api/club/events` - List club's events

### Counsellor Endpoints

- `POST /api/counsellor/events/:id/verify` - Verify student participation
- `GET /api/counsellor/students` - List assigned students

### Admin Endpoints

- `POST /api/admin/events/:id/approve` - Approve pending events
- `GET /api/admin/users` - Manage all users
- `GET /api/admin/statistics` - System-wide statistics

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Technologies Used

- Next.js
- MongoDB with Mongoose
- JWT Authentication
- TypeScript
- Tailwind CSS 