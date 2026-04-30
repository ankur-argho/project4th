import { Router, Response } from 'express';
import User from '../models/User.js';
import Professional from '../models/Professional.js';
import { generateToken, authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res: Response) => {
  try {
    const { email, password, fullName, role, professionalType } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = await User.create({
      email,
      password,
      fullName,
      role,
    });

    if (role === 'professional') {
      const type = (professionalType || 'doctor') as 'doctor' | 'tutor' | 'consultant';
      const defaultSpecialty =
        type === 'tutor' ? 'Tutoring' : type === 'consultant' ? 'Consulting' : 'Dermatology';

      await Professional.create({
        userId: user._id,
        type,
        specialty: defaultSpecialty,
        bio: '',
        hourlyRate: 0,
      });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return res.json({
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      token,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
