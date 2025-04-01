import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { EventModel } from '@/lib/db-schema';
import mongoose from 'mongoose';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
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
    const event = await EventModel.findById(id)
      .populate('club', 'name email')
      .populate('registrations.user', 'name email usn');
    
    if (!event) {
      return NextResponse.json(
        { message: 'Event not found' },
        { status: 404 }
      );
    }
    
    // Return event
    return NextResponse.json({
      message: 'Event retrieved successfully',
      event
    });
    
  } catch (error) {
    console.error('Event fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 