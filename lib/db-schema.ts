// Database Schema Definition
// This file contains all the MongoDB schema definitions for the application

import mongoose, { Document, Schema, model, models, Model, Types } from 'mongoose';

// Define type constants
export const CLUB_TYPES = ["technical", "social", "cultural", "sports"] as const;
export const EVENT_STATUS = ["upcoming", "ongoing", "completed", "pending", "verified"] as const;
export type ClubType = typeof CLUB_TYPES[number];
export type EventStatus = typeof EVENT_STATUS[number];

// Define interfaces
export interface IAdmin extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
}

export interface IBranch extends Document {
  name: string;
  code: string;
  hod: string;
  counsellors: Types.ObjectId[];
}

export interface ICounsellor extends Document {
  email: string;
  name: string;
  password: string;
  branch: Types.ObjectId;
  is_club_counsellor: boolean;
}

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  usn: string;
  branch: Types.ObjectId;
  counsellor: Types.ObjectId;
  clubs: Types.ObjectId[];
  activity_point: number;
  points_breakdown: {
    technical: number;
    cultural: number;
    sports: number;
    social: number;
  };
  participation_history: Array<{
    event: Types.ObjectId;
    date: Date;
    points: number;
    status: 'verified' | 'pending';
  }>;
  targetPoints: number; // Virtual property
}

export interface IClub extends Document {
  name: string;
  club_type: ClubType;
  pocs: Types.ObjectId[];
  faculty_in_charge: Types.ObjectId;
  description: string;
  total_events: number;
  pending_verification: number;
  upcoming_events: number;
}

export interface IEvent extends Document {
  name: string;
  status: EventStatus;
  verified: boolean;
  date: Date;
  time: string;
  club: Types.ObjectId;
  organizer: string;
  activity_point: number;
  form_link?: string;
  deadline: Date;
  location: string;
  description?: string;
  excel_url?: string;
  participants: number;
  participants_list: Types.ObjectId[];
  registered_students: Types.ObjectId[];
}

// Admin Schema
const AdminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  collection: 'admins',
  timestamps: true
});

// Branch Schema
const BranchSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  hod: {
    type: String,
    required: true,
    trim: true
  },
  counsellors: [{
    type: Schema.Types.ObjectId,
    ref: 'Counsellor'
  }]
}, { 
  collection: 'branches',
  timestamps: true
});

// Counsellor Schema
const CounsellorSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  is_club_counsellor: {
    type: Boolean,
    default: false
  }
}, { 
  collection: 'counsellors',
  timestamps: true
});

// User (Student) Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  usn: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  branch: {
    type: Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  counsellor: {
    type: Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true
  },
  clubs: [{
    type: Schema.Types.ObjectId,
    ref: 'Club'
  }],
  activity_point: {
    type: Number,
    default: 0
  },
  // Store detailed breakdown of points
  points_breakdown: {
    technical: { type: Number, default: 0 },
    cultural: { type: Number, default: 0 },
    sports: { type: Number, default: 0 },
    social: { type: Number, default: 0 }
  },
  // Event participation history for displaying on student dashboard
  participation_history: [{
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    date: {
      type: Date,
      default: Date.now
    },
    points: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['verified', 'pending'],
      default: 'pending'
    }
  }]
}, { 
  collection: 'users',
  timestamps: true
});

// Club Schema
const ClubSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  club_type: {
    type: String,
    required: true,
    enum: CLUB_TYPES
  },
  pocs: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  faculty_in_charge: {
    type: Schema.Types.ObjectId,
    ref: 'Counsellor',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  // Track club statistics
  total_events: {
    type: Number,
    default: 0
  },
  pending_verification: {
    type: Number,
    default: 0
  },
  upcoming_events: {
    type: Number,
    default: 0
  }
}, { 
  collection: 'clubs',
  timestamps: true
});

// Event Schema
const EventSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: EVENT_STATUS,
    default: 'upcoming'
  },
  verified: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  club: {
    type: Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  activity_point: {
    type: Number,
    required: true,
    min: 1
  },
  form_link: {
    type: String,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  excel_url: {
    type: String,
    trim: true
  },
  // Track participation
  participants: {
    type: Number,
    default: 0
  },
  participants_list: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  registered_students: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { 
  collection: 'events',
  timestamps: true
});

// Virtual fields for Student model
UserSchema.virtual('targetPoints').get(function() {
  return 100; // Total target is 100 points
});

// Define models with their interfaces
export const AdminModel: Model<IAdmin> = models.Admin || model<IAdmin>('Admin', AdminSchema);
export const BranchModel: Model<IBranch> = models.Branch || model<IBranch>('Branch', BranchSchema);
export const CounsellorModel: Model<ICounsellor> = models.Counsellor || model<ICounsellor>('Counsellor', CounsellorSchema);
export const UserModel: Model<IUser> = models.User || model<IUser>('User', UserSchema);
export const ClubModel: Model<IClub> = models.Club || model<IClub>('Club', ClubSchema);
export const EventModel: Model<IEvent> = models.Event || model<IEvent>('Event', EventSchema);

// Event hooks for maintaining counters and relationships
EventSchema.pre('save', async function(this: IEvent, next: any) {
  const event = this;
  const isNew = event.isNew;
  
  // Update club statistics based on event status
  if (isNew) {
    if (event.status === 'upcoming') {
      await ClubModel.findByIdAndUpdate(event.club, { 
        $inc: { total_events: 1, upcoming_events: 1 }
      });
    } else if (event.status === 'pending') {
      await ClubModel.findByIdAndUpdate(event.club, { 
        $inc: { total_events: 1, pending_verification: 1 }
      });
    } else {
      await ClubModel.findByIdAndUpdate(event.club, { 
        $inc: { total_events: 1 }
      });
    }
  }
  next();
});

// Export default models
export default {
  Admin: AdminModel,
  Branch: BranchModel,
  Counsellor: CounsellorModel,
  User: UserModel,
  Club: ClubModel,
  Event: EventModel
}; 