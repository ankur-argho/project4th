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
declare const Professional: mongoose.Model<IProfessional, {}, {}, {}, mongoose.Document<unknown, {}, IProfessional, {}, {}> & IProfessional & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Professional;
//# sourceMappingURL=Professional.d.ts.map