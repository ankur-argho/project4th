import mongoose from 'mongoose';

export interface IService extends mongoose.Document {
  name: string;
  description: string;
  category: string;
  providerType: 'any' | 'doctor' | 'tutor' | 'consultant';
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new mongoose.Schema<IService>(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      trim: true,
    },
    providerType: {
      type: String,
      enum: ['any', 'doctor', 'tutor', 'consultant'],
      default: 'any',
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: 1,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;
