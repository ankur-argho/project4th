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
declare const Booking: mongoose.Model<IBooking, {}, {}, {}, mongoose.Document<unknown, {}, IBooking, {}, {}> & IBooking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Booking;
//# sourceMappingURL=Booking.d.ts.map