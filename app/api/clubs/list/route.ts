import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { ClubModel } from '@/lib/db-schema';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all active clubs with only necessary fields
    const clubs = await ClubModel.find({}, 'name _id').lean();
    
    return NextResponse.json({ 
      success: true, 
      clubs: clubs.map(club => ({
        id: club._id.toString(),
        name: club.name
      }))
    });
    
  } catch (error) {
    
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}
