import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { EventModel } from '@/lib/db-schema';

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const club = searchParams.get('club');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    
    // Build query
    const query: any = {};
    if (status) query.status = status;
    if (club) query.club = club;
    if (category) query.category = category;
    
    // Get total count for pagination
    const total = await EventModel.countDocuments(query);
    
    // Fetch events with pagination
    const events = await EventModel.find(query)
      .populate('club', 'name email')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    // Return events
    return NextResponse.json({
      message: 'Events retrieved successfully',
      events,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Events fetch error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 