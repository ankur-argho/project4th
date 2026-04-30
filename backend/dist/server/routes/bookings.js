import { Router } from 'express';
import Booking from '../models/Booking.js';
import TimeSlot from '../models/TimeSlot.js';
import Service from '../models/Service.js';
import Professional from '../models/Professional.js';
import { authenticate, authorize } from '../middleware/auth.js';
const router = Router();
router.get('/my-bookings', authenticate, async (req, res) => {
    try {
        const bookings = await Booking.find({ clientId: req.user?.id })
            .populate('serviceId', 'name category price')
            .populate('professionalId')
            .populate('timeSlotId', 'startTime endTime')
            .sort({ createdAt: -1 })
            .lean();
        return res.json(bookings);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.get('/professional/bookings', authenticate, authorize('professional'), async (req, res) => {
    try {
        const professional = await Professional.findOne({ userId: req.user?.id });
        if (!professional) {
            return res.status(404).json({ error: 'Professional profile not found' });
        }
        const bookings = await Booking.find({ professionalId: professional._id })
            .populate('clientId', 'fullName email')
            .populate('serviceId', 'name category price')
            .populate('timeSlotId', 'startTime endTime')
            .sort({ createdAt: -1 })
            .lean();
        return res.json(bookings);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/', authenticate, async (req, res) => {
    try {
        const { professionalId, serviceId, timeSlotId, notes } = req.body;
        const timeSlot = await TimeSlot.findById(timeSlotId);
        if (!timeSlot || !timeSlot.isAvailable) {
            return res.status(400).json({ error: 'Time slot is not available' });
        }
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        const booking = await Booking.create({
            clientId: req.user?.id,
            professionalId,
            serviceId,
            timeSlotId,
            notes: notes || '',
            totalAmount: service.price,
            status: 'pending',
        });
        await TimeSlot.findByIdAndUpdate(timeSlotId, { isAvailable: false });
        const populatedBooking = await Booking.findById(booking._id)
            .populate('serviceId', 'name category price')
            .populate('professionalId')
            .populate('timeSlotId', 'startTime endTime')
            .lean();
        return res.status(201).json(populatedBooking);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.put('/:id/status', authenticate, authorize('professional'), async (req, res) => {
    try {
        const { status } = req.body;
        if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })
            .populate('clientId', 'fullName email')
            .populate('serviceId', 'name category price')
            .populate('timeSlotId', 'startTime endTime')
            .lean();
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (status === 'cancelled') {
            await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { isAvailable: true });
        }
        return res.json(booking);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.put('/:id/cancel', authenticate, async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            clientId: req.user?.id,
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        if (booking.status === 'cancelled' || booking.status === 'completed') {
            return res.status(400).json({ error: 'Cannot cancel this booking' });
        }
        booking.status = 'cancelled';
        await booking.save();
        await TimeSlot.findByIdAndUpdate(booking.timeSlotId, { isAvailable: true });
        const updatedBooking = await Booking.findById(booking._id)
            .populate('serviceId', 'name category price')
            .populate('professionalId')
            .populate('timeSlotId', 'startTime endTime')
            .lean();
        return res.json(updatedBooking);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=bookings.js.map