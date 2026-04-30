import mongoose from 'mongoose';
export interface ITimeSlot extends mongoose.Document {
    professionalId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const TimeSlot: mongoose.Model<ITimeSlot, {}, {}, {}, mongoose.Document<unknown, {}, ITimeSlot, {}, {}> & ITimeSlot & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default TimeSlot;
//# sourceMappingURL=TimeSlot.d.ts.map