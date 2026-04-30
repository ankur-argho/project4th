import mongoose from 'mongoose';

export interface IBooking extends mongoose.Document {
  clientId: mongoose.Types.ObjectId;
  professionalId: mongoose.Types.ObjectId;
  serviceId: mongoose.Types.ObjectId;
  timeSlotId: mongoose.Types.ObjectId;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    timeSlotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ clientId: 1, createdAt: -1 });
bookingSchema.index({ professionalId: 1, createdAt: -1 });

const Booking = mongoose.model<IBooking>('Booking', bookingSchema);

export default Booking;
