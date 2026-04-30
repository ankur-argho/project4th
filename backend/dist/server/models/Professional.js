import mongoose from 'mongoose';
const professionalSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
const Professional = mongoose.model('Professional', professionalSchema);
export default Professional;
//# sourceMappingURL=Professional.js.map