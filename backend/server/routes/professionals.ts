import { Router, Response } from 'express';
import Professional from '../models/Professional.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const { specialty, search } = req.query;

    const query: any = {};
    if (specialty) {
      query.specialty = specialty;
    }
    if (search) {
      query.$or = [
        { specialty: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    const professionals = await Professional.find(query)
      .populate('userId', 'fullName email')
      .sort({ rating: -1 })
      .lean();

    return res.json(professionals);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/specialties', async (_req, res: Response) => {
  try {
    const specialties = await Professional.distinct('specialty');
    return res.json(specialties);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/my-profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const professional = await Professional.findOne({ userId: req.user?.id })
      .populate('userId', 'fullName email')
      .lean();

    if (!professional) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    return res.json(professional);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/my-profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { specialty, bio, hourlyRate, type } = req.body;

    const professional = await Professional.findOneAndUpdate(
      { userId: req.user?.id },
      { specialty, bio, hourlyRate, ...(type ? { type } : {}) },
      { new: true, runValidators: true }
    );

    if (!professional) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    return res.json(professional);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res: Response) => {
  try {
    const professional = await Professional.findById(req.params.id)
      .populate('userId', 'fullName email')
      .lean();

    if (!professional) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    return res.json(professional);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
