import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db-connect';
import { UserModel, AdminModel, CounsellorModel, IUser, IAdmin, ICounsellor } from '@/lib/db-schema';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';

type AuthUser = {
  _id: string;
  email: string;
  name: string;
  password: string;
  is_club_counsellor?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse request body
    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Check for user across different collections
    let user: (Document<unknown, any, any> & AuthUser) | null = null;
    let role = '';
    
    // Try to find student
    const student = await UserModel.findOne({ email }).select('+password');
    if (student) {
      user = student as any;
      role = 'student';
    }
    
    // Try to find counsellor
    if (!user) {
      const counsellor = await CounsellorModel.findOne({ email }).select('+password');
      if (counsellor) {
        user = counsellor as any;
        role = counsellor.is_club_counsellor ? 'club' : 'counsellor';
      }
    }
    
    // Try to find admin
    if (!user) {
      const admin = await AdminModel.findOne({ email }).select('+password');
      if (admin) {
        user = admin as any;
        role = 'admin';
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );
    
    // Create user data to return
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role
    };
    
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 