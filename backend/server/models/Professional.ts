import mongoose from 'mongoose';

export interface IProfessional extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  type: 'doctor' | 'tutor' | 'consultant';
  specialty: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const professionalSchema = new mongoose.Schema<IProfessional>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['doctor', 'tutor', 'consultant'],
      required: true,
      default: 'doctor',
      index: true,
    },
    specialty: {
      type: String,
      required: [true, 'Specialty is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Professional = mongoose.model<IProfessional>('Professional', professionalSchema);

export default Professional;
