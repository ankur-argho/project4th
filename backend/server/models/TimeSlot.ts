import mongoose from 'mongoose';

export interface ITimeSlot extends mongoose.Document {
  professionalId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new mongoose.Schema<ITimeSlot>(
  {
    professionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

timeSlotSchema.index({ professionalId: 1, startTime: 1 });

const TimeSlot = mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);

export default TimeSlot;
