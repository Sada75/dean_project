import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { AdminModel } from '@/lib/db-schema';

export async function GET() {
  try {
    // Use the shared database connection
    await connectToDatabase();
    
    // Find all admin users with role 'teacher'
    const teachers = await AdminModel.find({ 
      role: 'teacher',
      is_club_counsellor: false 
    }).select('_id name email branch');
    
    return NextResponse.json({ teachers });
    
  } catch (error) {
    console.error('Error fetching teachers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teachers' },
      { status: 500 }
    );
  }
}
