import mongoose from 'mongoose';
const timeSlotSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
timeSlotSchema.index({ professionalId: 1, startTime: 1 });
const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);
export default TimeSlot;
//# sourceMappingURL=TimeSlot.js.map