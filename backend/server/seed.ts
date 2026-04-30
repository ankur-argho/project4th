import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Professional from './models/Professional.js';
import Service from './models/Service.js';
import TimeSlot from './models/TimeSlot.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined');
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Professional.deleteMany({});
    await Service.deleteMany({});
    await TimeSlot.deleteMany({});
    console.log('Cleared existing data');

    // Create services
    await Service.insertMany([
      {
        name: 'Skin Consultation',
        description: 'Professional skin consultation for ointment treatment',
        category: 'Dermatology',
        durationMinutes: 30,
        price: 50,
        isActive: true,
      },
      {
        name: 'Ointment Application',
        description: 'Professional ointment application and treatment',
        category: 'Treatment',
        durationMinutes: 45,
        price: 75,
        isActive: true,
      },
      {
        name: 'Follow-up Consultation',
        description: 'Follow-up consultation to assess treatment progress',
        category: 'Consultation',
        durationMinutes: 20,
        price: 30,
        isActive: true,
      },
      {
        name: 'Comprehensive Skin Assessment',
        description: 'Complete skin assessment with personalized treatment plan',
        category: 'Assessment',
        durationMinutes: 60,
        price: 100,
        isActive: true,
      },
    ]);
    console.log('Created services');

    // Create professional users
    const professionals = [
      {
        email: 'dr.smith@ointmentpro.com',
        password: 'password123',
        fullName: 'Dr. Sarah Smith',
        role: 'professional' as const,
      },
      {
        email: 'dr.johnson@ointmentpro.com',
        password: 'password123',
        fullName: 'Dr. Michael Johnson',
        role: 'professional' as const,
      },
      {
        email: 'dr.williams@ointmentpro.com',
        password: 'password123',
        fullName: 'Dr. Emily Williams',
        role: 'professional' as const,
      },
    ];

    for (const profData of professionals) {
      const user = await User.create(profData);
      
      await Professional.create({
        userId: user._id,
        specialty: 'Dermatology',
        bio: `Experienced dermatologist specializing in ointment treatments and skin care.`,
        hourlyRate: 80,
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(Math.random() * 50) + 10,
      });
    }
    console.log('Created professional users');

    // Create client users
    const clients = [
      {
        email: 'client1@example.com',
        password: 'password123',
        fullName: 'John Doe',
        role: 'client' as const,
      },
      {
        email: 'client2@example.com',
        password: 'password123',
        fullName: 'Jane Smith',
        role: 'client' as const,
      },
    ];

    for (const clientData of clients) {
      await User.create(clientData);
    }
    console.log('Created client users');

    // Create some time slots for the first professional
    const firstProfessional = await Professional.findOne();
    if (firstProfessional) {
      const now = new Date();
      const timeSlots: Array<{
        professionalId: mongoose.Types.ObjectId;
        startTime: Date;
        endTime: Date;
        isAvailable: boolean;
      }> = [];
      
      for (let i = 0; i < 10; i++) {
        const startTime = new Date(now);
        startTime.setDate(startTime.getDate() + i);
        startTime.setHours(9, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(10, 0, 0, 0);
        
        timeSlots.push({
          professionalId: firstProfessional._id,
          startTime,
          endTime,
          isAvailable: true,
        });
      }
      
      await TimeSlot.insertMany(timeSlots);
      console.log('Created time slots');
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('Professional: dr.smith@ointmentpro.com / password123');
    console.log('Client: client1@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
