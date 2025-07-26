import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Connection } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  ClubModel,
  AdminModel,
  CounsellorModel,
  IUser,
  IClub,
  IAdmin,
  ICounsellor,
} from '@/lib/db-schema';

// Map role to db name and model
const dbConfig = {
  student: { dbName: 'students_db', model: UserModel },
  club: { dbName: 'clubs_db', model: ClubModel },
  admin: { dbName: 'admins_db', model: AdminModel },
  dean: { dbName: 'admins_db', model: AdminModel }, // Dean uses admin database
  counsellor: { dbName: 'counsellors_db', model: CounsellorModel },
};

type RoleKey = keyof typeof dbConfig;
const connections: Record<string, Connection> = {};

// Type guards
function hasPasswordAndEmail(obj: any): obj is { password: string; email: string; name: string; _id: any } {
  return (
    obj &&
    typeof obj.password === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    '_id' in obj
  );
}

function hasEmailName(obj: any): obj is { email: string; name: string; _id: any } {
  return (
    obj &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    '_id' in obj
  );
}

// Connect to the correct database and create it if it doesn't exist
async function getDbModel(role: RoleKey) {
  const config = dbConfig[role];
  if (!config) throw new Error('Invalid role');
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
  const dbUri = uri.endsWith('/') ? uri + config.dbName : uri + '/' + config.dbName;
  if (!connections[config.dbName]) {
    // This will create the database if it doesn't exist
    const conn = await mongoose.createConnection(dbUri).asPromise();
    console.log('Connected to database:', config.dbName);
    connections[config.dbName] = conn;
  }
  // Return the model from the correct connection
  return connections[config.dbName].model(config.model.modelName, config.model.schema);
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    if (!email || !password || !role) {
      return NextResponse.json({ message: 'Email, password, and role are required' }, { status: 400 });
    }
    const Model = await getDbModel(role as RoleKey);
    const user = await Model.findOne({ email }).select('+password');
    if (!hasPasswordAndEmail(user)) {
      return NextResponse.json({ message: 'User not found' }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
      dashboardPath: role,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
} 