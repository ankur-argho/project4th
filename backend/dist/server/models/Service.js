import mongoose from 'mongoose';
const serviceSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
const Service = mongoose.model('Service', serviceSchema);
export default Service;
//# sourceMappingURL=Service.js.map