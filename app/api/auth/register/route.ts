import { NextRequest, NextResponse } from 'next/server';
import mongoose, { Connection } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserModel,
  ClubModel,
  AdminModel,
  BranchModel,
  IUser,
  IClub,
  CLUB_TYPES,
} from '@/lib/db-schema';

// Map role to db name and model
const dbConfig = {
  student: { dbName: 'students_db', model: UserModel },
  club: { dbName: 'clubs_db', model: ClubModel },
  admin: { dbName: 'admins_db', model: AdminModel },
  dean: { dbName: 'admins_db', model: AdminModel }, // Dean uses admin database
  // Note: 'counsellor' role is no longer used as a separate role
};

type RoleKey = 'student' | 'club' | 'admin' | 'dean';
const connections: Record<string, Connection> = {};

// Type guard for registration response
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

// Helper function to get or create branch
async function getOrCreateBranch(branchCode: string, branchName: string): Promise<string> {
  // Use the default mongoose connection for branch operations
  const BranchModelInstance = mongoose.model('Branch', BranchModel.schema);
  
  let branch = await BranchModelInstance.findOne({ code: branchCode });
  if (!branch) {
    branch = await BranchModelInstance.create({
      name: branchName,
      code: branchCode,
      hod: 'TBD', // Default HOD
      counsellors: []
    });
  }
  // Fix: branch._id is of type unknown, so cast to ObjectId first
  if (!branch._id || typeof branch._id !== 'object' || !('toString' in branch._id)) {
    throw new Error('Branch _id is missing or invalid');
  }
  return (branch._id as mongoose.Types.ObjectId).toString();
}

// Helper function to find a teacher counsellor for a branch
async function findTeacherCounsellor(branchId: string) {
  const AdminModelInstance = mongoose.model('Admin', AdminModel.schema);
  const counsellor = await AdminModelInstance.findOne({
    role: 'teacher',
    branch: branchId,
    is_club_counsellor: false
  });
  
  if (!counsellor) {
    throw new Error(`No teacher counsellor found for branch ${branchId}. Please contact an administrator.`);
  }
  return counsellor._id;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, role, ...additionalFields } = await req.json();
    let user; // Declare user variable at the beginning of the function

    // Validate required fields
    if (!email || !password || !name || !role) {
      return NextResponse.json({
        message: 'Email, password, name, and role are required'
      }, { status: 400 });
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    const Model = await getDbModel(role as RoleKey);

    // Check if user already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        message: 'User with this email already exists'
      }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare user data based on role
    let userData: any = {
      email,
      password: hashedPassword,
      name
    };

    switch (role) {
      case 'student':
        const { usn, branch, year, graduationYear, selectedCounsellor, selectedClubs = [] } = additionalFields;
        if (!usn || !branch || !year || !graduationYear ) {
          return NextResponse.json({
            message: 'USN, branch, year, graduation year, and counsellor are required for student registration'
          }, { status: 400 });
        }

        // Get or create branch
        // const branchId = await getOrCreateBranch(branch, branch);
        const branchId = "64cfe1d6b98e8a0012d65f05";
        
        // Use the selected counsellor instead of auto-assigning
        // const counsellorId = new mongoose.Types.ObjectId(selectedCounsellor);

        // Validate clubs exist and convert to ObjectId
        // let clubIds: mongoose.Types.ObjectId[] = [];
        // try {
        //   clubIds = selectedClubs.map((clubId: string) => new mongoose.Types.ObjectId(clubId));
        // } catch (error) {
        //   return NextResponse.json({
        //     message: 'Invalid club selection'
        //   }, { status: 400 });
        // }

        userData = {
          ...userData,
          usn: usn.toUpperCase(),
          branch: branchId,
          // counsellor: counsellorId,
          year: parseInt(year, 10),
          graduationYear: parseInt(graduationYear, 10),
          // clubs: clubIds,
          activity_point: 0,
          points_breakdown: {
            technical: 0,
            cultural: 0,
            sports: 0,
            social: 0
          },
          participation_history: []
        };

        // The user will be created after the switch statement
        break;

      case 'club':
        const { clubName, clubType } = additionalFields;
        if (!clubName || !clubType) {
          return NextResponse.json({
            message: 'Club name and type are required for club registration'
          }, { status: 400 });
        }

        // Validate club type
        if (!CLUB_TYPES.includes(clubType.toLowerCase() as any)) {
          return NextResponse.json({
            message: `Invalid club type. Must be one of: ${CLUB_TYPES.join(', ')}`
          }, { status: 400 });
        }

        userData = {
          ...userData,
          name: clubName,
          club_type: clubType.toLowerCase(),
          pocs: [],
          faculty_in_charge: null, // Will be set later
          description: '',
          total_events: 0,
          pending_verification: 0,
          upcoming_events: 0
        };
        break;

      case 'admin':
      case 'dean':
      case 'counsellor':
        // Admin, dean, and counsellor accounts must be created through admin interface
        return NextResponse.json({
          message: 'This type of account cannot be registered through this endpoint.'
        }, { status: 403 });
      
      default:
        return NextResponse.json({
          message: 'Invalid role. Only student and club registration is allowed.'
        }, { status: 400 });
    }

    // Create user
    user = await Model.create(userData);

    if (!hasEmailName(user)) {
      return NextResponse.json({
        message: 'Registration failed'
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      message: 'Internal server error'
    }, { status: 500 });
  }
} 