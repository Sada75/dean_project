import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { EventModel, ClubModel } from '@/lib/db-schema';
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
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: 'Unauthorized, admin access required' },
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
    
    // Check if event is in pending status
    if (event.status !== 'pending') {
      return NextResponse.json(
        { message: 'Only pending events can be approved' },
        { status: 400 }
      );
    }
    
    // Update event status to upcoming and set verified flag
    await EventModel.findByIdAndUpdate(id, {
      status: 'upcoming',
      verified: true
    });
    
    // Update club statistics
    await ClubModel.findByIdAndUpdate(event.club, {
      $inc: { pending_verification: -1, upcoming_events: 1 }
    });
    
    // Return success
    return NextResponse.json({
      message: 'Event approved successfully'
    });
    
  } catch (error) {
    console.error('Event approval error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 