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
declare const Service: mongoose.Model<IService, {}, {}, {}, mongoose.Document<unknown, {}, IService, {}, {}> & IService & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Service;
//# sourceMappingURL=Service.d.ts.map