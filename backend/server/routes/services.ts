import { Router, Response } from 'express';
import Service from '../models/Service.js';
import { authenticate, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res: Response) => {
  try {
    const { category, isActive, providerType } = req.query;

    const query: any = {};
    if (category) {
      query.category = category;
    }
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (providerType) {
      query.providerType = { $in: [providerType, 'any'] };
    }

    const services = await Service.find(query).sort({ name: 1 }).lean();
    return res.json(services);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/categories', async (_req, res: Response) => {
  try {
    const categories = await Service.distinct('category');
    return res.json(categories);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, authorize('professional'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, category, durationMinutes, price } = req.body;

    const service = await Service.create({
      name,
      description,
      category,
      durationMinutes,
      price,
    });

    return res.status(201).json(service);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, authorize('professional'), async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json(service);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, authorize('professional'), async (req: AuthRequest, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json({ message: 'Service deactivated' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
