import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { UserModel, CounsellorModel, BranchModel } from '@/lib/db-schema';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse request body
    const { email, password, usn, name, branch, year, councellor_id } = await req.json();
    
    // Validate input
    if (!email || !password || !usn || !name || !branch || !year) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ 
      $or: [{ email }, { usn }]
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email or USN' },
        { status: 400 }
      );
    }
    
    // Check if counsellor exists
    if (councellor_id) {
      const counsellor = await CounsellorModel.findById(councellor_id);
      if (!counsellor) {
        return NextResponse.json(
          { message: 'Counsellor not found' },
          { status: 400 }
        );
      }
    }
    
    // Check if branch exists or create it
    let branchDoc = await BranchModel.findOne({ branch, year });
    if (!branchDoc) {
      branchDoc = await BranchModel.create({ branch, year });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      usn,
      name,
      branch: branchDoc._id,
      councellor: councellor_id || null,
      points: 0,
      events_registered: [],
      events_participated: []
    });
    
    // Return success without password
    const userData = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
      usn: newUser.usn
    };
    
    return NextResponse.json({
      message: 'Registration successful',
      user: userData
    }, { status: 201 });
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 