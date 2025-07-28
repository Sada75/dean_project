import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { CounsellorModel, IBranch } from '@/lib/db-schema';
import bcrypt from 'bcryptjs';

interface CounsellorResponse {
  _id: string;
  name: string;
  email: string;
  branch: {
    name: string;
    code: string;
  } | null;
}

// Connect to the counsellors database
const connectToCounsellorsDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
  const dbUri = uri.endsWith('/') ? uri + 'counsellors_db' : uri + '/counsellors_db';
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUri);
  }
  
  return mongoose.connection.model('Counsellor', CounsellorModel.schema);
};

export async function GET() {
  try {
    const Counsellor = await connectToCounsellorsDB();
    
    // Fetch all counsellors and populate the branch field
    const counsellors = await CounsellorModel.find()
      .populate<{ branch: IBranch }>('branch')
      .select('name email branch')
      .lean()
      .then(docs => docs.map(doc => ({
        _id: doc._id.toString(),
        name: doc.name,
        email: doc.email,
        branch: doc.branch ? {
          name: doc.branch.name,
          code: doc.branch.code
        } : null
      })));

    return NextResponse.json({ counsellors });
  } catch (error) {
    console.error('Error fetching counsellors:', error);
    return NextResponse.json(
      { message: 'Failed to fetch counsellors' },
      { status: 500 }
    );
  } finally {
    // Don't close the connection to reuse it
    // await mongoose.connection.close();
  }
}

// POST endpoint for counsellor registration
export async function POST(request: Request) {
  try {
    const { name, email, password, branchId } = await request.json();

    // Validate input
    if (!name || !email || !password || !branchId) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCounsellor = await CounsellorModel.findOne({ email });
    if (existingCounsellor) {
      return NextResponse.json(
        { message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new counsellor
    const newCounsellor = new CounsellorModel({
      name,
      email,
      password: hashedPassword,
      branch: branchId,
      is_club_counsellor: false // Default value
    });

    await newCounsellor.save();

    // Return success response without sensitive data
    const { password: _, ...counsellorData } = newCounsellor.toObject();
    
    return NextResponse.json(
      { 
        message: 'Counsellor registered successfully',
        counsellor: counsellorData 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error registering counsellor:', error);
    return NextResponse.json(
      { message: 'Failed to register counsellor' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; // Ensure dynamic server-side rendering
