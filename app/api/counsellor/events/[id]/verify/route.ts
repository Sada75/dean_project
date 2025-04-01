import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { EventModel, UserModel, CounsellorModel, ClubModel } from '@/lib/db-schema';
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
    if (!user || (user.role !== 'counsellor' && user.role !== 'admin')) {
      return NextResponse.json(
        { message: 'Unauthorized, counsellor or admin access required' },
        { status: 401 }
      );
    }
    
    // Connect to the database
    await connectToDatabase();
    
    const { id } = params;
    
    // Validate event ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid event ID' },
        { status: 400 }
      );
    }
    
    // Parse request body
    const { students, verified = true } = await req.json();
    
    if (!Array.isArray(students) || students.length === 0) {
      return NextResponse.json(
        { message: 'Students array is required' },
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
    
    // Get club details to determine club type
    const club = await ClubModel.findById(event.club);
    if (!club) {
      return NextResponse.json(
        { message: 'Club not found for this event' },
        { status: 404 }
      );
    }
    
    // If counsellor, check if they are authorized for these students
    if (user.role === 'counsellor') {
      const counsellor = await CounsellorModel.findOne({ email: user.email });
      
      if (!counsellor) {
        return NextResponse.json(
          { message: 'Counsellor not found' },
          { status: 404 }
        );
      }
      
      // Verify students belong to counsellor
      const studentCount = await UserModel.countDocuments({
        _id: { $in: students },
        counsellor: counsellor._id
      });
      
      if (studentCount !== students.length) {
        return NextResponse.json(
          { message: 'You can only verify your assigned students' },
          { status: 403 }
        );
      }
    }
    
    // Add students to participants list
    await EventModel.findByIdAndUpdate(id, {
      $addToSet: { 
        participants_list: { $each: students }
      },
      $inc: { 
        participants: students.length
      }
    });
    
    // For each student, add event to their participation history
    for (const studentId of students) {
      await UserModel.findByIdAndUpdate(studentId, {
        $push: {
          participation_history: {
            event: id,
            date: new Date(),
            points: event.activity_point,
            status: verified ? 'verified' : 'pending'
          }
        },
        $inc: {
          activity_point: verified ? event.activity_point : 0,
          [`points_breakdown.${club.club_type}`]: verified ? event.activity_point : 0
        }
      });
    }
    
    // Return success
    return NextResponse.json({
      message: 'Student participation verified successfully',
      count: students.length
    });
    
  } catch (error) {
    console.error('Event verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 