import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import connectMongo from './config/db.js';
import authRoutes from './routes/auth.js';
import professionalRoutes from './routes/professionals.js';
import serviceRoutes from './routes/services.js';
import timeSlotRoutes from './routes/timeSlots.js';
import bookingRoutes from './routes/bookings.js';
import Service from './models/Service.js';

const app = express();

const isVercel = process.env.VERCEL === '1';


// ✅ FINAL CORS FIX (PRODUCTION SAFE)
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://ointmentpro.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ HANDLE PREFLIGHT (CRITICAL)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let warmupPromise: Promise<void> | null = null;


// =============================
// 🔹 SEED CORE SERVICES
// =============================
async function ensureCoreServices() {
  const coreServices = [
    {
      name: 'Skin Consultation',
      description: 'Professional skin consultation for ointment treatment',
      category: 'Dermatology',
      providerType: 'doctor',
      durationMinutes: 30,
      price: 50,
      isActive: true,
    },
    {
      name: 'Ointment Application',
      description: 'Professional ointment application and treatment',
      category: 'Treatment',
      providerType: 'doctor',
      durationMinutes: 45,
      price: 75,
      isActive: true,
    },
    {
      name: 'Follow-up Consultation',
      description: 'Follow-up consultation to assess treatment progress',
      category: 'Consultation',
      providerType: 'doctor',
      durationMinutes: 20,
      price: 30,
      isActive: true,
    },
    {
      name: 'Comprehensive Skin Assessment',
      description: 'Complete skin assessment with personalized treatment plan',
      category: 'Assessment',
      providerType: 'doctor',
      durationMinutes: 60,
      price: 100,
      isActive: true,
    },
    {
      name: '1:1 Tutoring Session',
      description: 'Focused 1:1 tutoring session tailored to your goals',
      category: 'Tutoring',
      providerType: 'tutor',
      durationMinutes: 60,
      price: 40,
      isActive: true,
    },
    {
      name: 'Exam Prep',
      description: 'Structured exam preparation and practice',
      category: 'Tutoring',
      providerType: 'tutor',
      durationMinutes: 90,
      price: 60,
      isActive: true,
    },
    {
      name: 'Business Consultation',
      description: 'Professional business strategy consultation',
      category: 'Consulting',
      providerType: 'consultant',
      durationMinutes: 60,
      price: 120,
      isActive: true,
    },
    {
      name: 'Career Guidance',
      description: 'Resume, interview prep, and career planning',
      category: 'Consulting',
      providerType: 'consultant',
      durationMinutes: 45,
      price: 80,
      isActive: true,
    },
  ] as const;

  let created = 0;

  for (const s of coreServices) {
    const exists = await Service.exists({ name: s.name });
    if (exists) continue;

    await Service.create(s);
    created++;
  }

  if (created > 0) {
    console.log(`Seeded ${created} core services`);
  }
}


// =============================
// 🔹 FIX PROVIDER TYPES
// =============================
async function ensureServiceProviderTypes() {
  await Service.updateMany(
    { providerType: { $exists: false }, category: { $in: ['Dermatology', 'Treatment', 'Consultation', 'Assessment'] } },
    { $set: { providerType: 'doctor' } }
  );

  await Service.updateMany(
    { providerType: { $exists: false }, category: { $in: ['Tutoring'] } },
    { $set: { providerType: 'tutor' } }
  );

  await Service.updateMany(
    { providerType: { $exists: false }, category: { $in: ['Consulting'] } },
    { $set: { providerType: 'consultant' } }
  );

  await Service.updateMany(
    { providerType: { $exists: false } },
    { $set: { providerType: 'any' } }
  );
}


// =============================
// 🔹 WARMUP (DB + SEED)
// =============================
export async function warmupApp(): Promise<void> {
  if (!warmupPromise) {
    warmupPromise = (async () => {
      await connectMongo();
      await ensureCoreServices();
      await ensureServiceProviderTypes();
    })();
  }

  await warmupPromise;
}


// =============================
// 🔹 ENSURE DB READY
// =============================
app.use(async (_req, res, next) => {
  try {
    await warmupApp();
    return next();
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : 'Database unavailable';

    return res.status(503).json({ error: message });
  }
});


// =============================
// 🔹 STATIC (LOCAL ONLY)
// =============================
if (!isVercel) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const vanillaStatic = path.join(__dirname, '..', 'vanilla');
  app.use('/vanilla', express.static(vanillaStatic));
}


// =============================
// 🔹 ROUTES
// =============================
app.use('/api/auth', authRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/time-slots', timeSlotRoutes);
app.use('/api/bookings', bookingRoutes);


// =============================
// 🔹 HEALTH CHECK
// =============================
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Ointment Booking System API is running',
  });
});


export default app;