import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { EventModel, UserModel } from '@/lib/db-schema';
import mongoose from 'mongoose';
import { verifyJWT } from '@/lib/auth';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    // Verify authentication
    const user = await verifyJWT(req);
    if (!user || user.role !== 'student') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    const { id } = params;
    
    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    // Find event
    const event = await EventModel.findById(id);
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Check if event is open for registration
    if (event.status !== 'upcoming') {
      return NextResponse.json(
        { message: 'Event is not open for registration' },
        { status: 400 }
      );
    }
    
    // Check if event has reached maximum participants
    const maxParticipants = event.get('maxParticipants'); // Access using get method
    const registeredStudents = event.registered_students || [];
    
    if (maxParticipants && registeredStudents.length >= maxParticipants) {
      return NextResponse.json(
        { message: 'Event has reached maximum participants' },
        { status: 400 }
      );
    }
    
    // Check if user is already registered
    const isRegistered = registeredStudents.some(
      (studentId) => studentId.toString() === user.id
    );
    
    if (isRegistered) {
      return NextResponse.json(
        { message: 'You are already registered for this event' },
        { status: 400 }
      );
    }
    
    // Register user for event
    await EventModel.findByIdAndUpdate(id, {
      $push: {
        registered_students: user.id
      }
    });
    
    // Add event to user's registered events
    await UserModel.findByIdAndUpdate(user.id, {
      $push: {
        events_registered: id
      }
    });
    
    // Return success
    return NextResponse.json({
      message: 'Successfully registered for event'
    });
    
  } catch (error) {
    console.error('Event registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 