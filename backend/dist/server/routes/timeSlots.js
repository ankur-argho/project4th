import { Router } from 'express';
import TimeSlot from '../models/TimeSlot.js';
import { authenticate, authorize } from '../middleware/auth.js';
import Professional from '../models/Professional.js';
const router = Router();
router.get('/professional/:professionalId', async (req, res) => {
    try {
        const { professionalId } = req.params;
        const { date, isAvailable } = req.query;
        const query = { professionalId };
        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.startTime = {
                $gte: startDate,
                $lte: endDate,
            };
        }
        const timeSlots = await TimeSlot.find(query)
            .sort({ startTime: 1 })
            .lean();
        return res.json(timeSlots);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.post('/', authenticate, authorize('professional'), async (req, res) => {
    try {
        const { startTime, endTime } = req.body;
        const professional = await Professional.findOne({ userId: req.user?.id });
        if (!professional) {
            return res.status(404).json({ error: 'Professional profile not found' });
        }
        const timeSlot = await TimeSlot.create({
            professionalId: professional._id,
            startTime,
            endTime,
            isAvailable: true,
        });
        return res.status(201).json(timeSlot);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.put('/:id', authenticate, authorize('professional'), async (req, res) => {
    try {
        const timeSlot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!timeSlot) {
            return res.status(404).json({ error: 'Time slot not found' });
        }
        return res.json(timeSlot);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
router.delete('/:id', authenticate, authorize('professional'), async (req, res) => {
    try {
        const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);
        if (!timeSlot) {
            return res.status(404).json({ error: 'Time slot not found' });
        }
        return res.json({ message: 'Time slot deleted' });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
export default router;
//# sourceMappingURL=timeSlots.js.map