import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { EventModel, ClubModel, EVENT_STATUS } from '@/lib/db-schema';
import { verifyJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyJWT(req);
    if (!user || (user.role !== 'club' && user.role !== 'admin')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    // Parse request body
    const body = await req.json();
    const { 
      title, 
      description, 
      date, 
      time, 
      venue, 
      points, 
      maxParticipants, 
      category,
      club: adminProvidedClub 
    } = body;
    
    // Validate input
    if (!title || !description || !date || !time || !venue || !points || !category) {
      return NextResponse.json(
        { message: 'All required fields must be provided' },
        { status: 400 }
      );
    }
    
    // Get club information (for club users)
    let clubId = null;
    if (user.role === 'club') {
      const club = await ClubModel.findOne({ email: user.email });
      if (!club) {
        return NextResponse.json(
          { message: 'Club not found' },
          { status: 404 }
        );
      }
      clubId = club._id;
    } else if (user.role === 'admin' && !adminProvidedClub) {
      return NextResponse.json(
        { message: 'Club ID is required for admin event creation' },
        { status: 400 }
      );
    } else if (user.role === 'admin') {
      clubId = adminProvidedClub;
    }
    
    // Create new event
    const newEvent = await EventModel.create({
      title,
      description,
      date,
      time,
      venue,
      points,
      maxParticipants: maxParticipants || null,
      category,
      club: clubId,
      status: 'pending',
      registrations: [],
      participated: []
    });
    
    // Return success
    return NextResponse.json({
      message: 'Event created successfully',
      event: newEvent
    }, { status: 201 });
    
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 