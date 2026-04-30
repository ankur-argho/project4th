# 🎯 OintmentPro - Professional Ointment Booking System

## ✅ Migration Complete: PostgreSQL (Supabase) → MongoDB

Your professional ointment booking system has been successfully migrated from **Supabase (PostgreSQL)** to **MongoDB** with a complete professional redesign!

---

## 🚀 What's New

### ✨ Major Improvements

1. **MongoDB Database**
   - Replaced Supabase with MongoDB for better scalability
   - NoSQL document-based architecture
   - Flexible schema design
   - Better performance for hierarchical data

2. **Professional UI/UX**
   - Modern gradient designs with professional color schemes
   - Enhanced user interfaces with smooth animations
   - Responsive layout for all devices
   - Professional branding as "OintmentPro"

3. **Enhanced Features**
   - **Rating & Review System**: Professionals can display ratings
   - **Service Categories**: Organized service management
   - **Advanced Filtering**: Filter by specialty, service, and date
   - **Booking Status Workflow**: Pending → Confirmed → Completed
   - **Real-time Availability**: Live time slot management

4. **Security Improvements**
   - JWT-based authentication
   - Password hashing with bcrypt
   - Protected API routes
   - Role-based access control

---

## 📋 Prerequisites

Before running the application, you need:

### 1. **Node.js** (v16 or higher)
```bash
# Check if installed
node --version

# Download from: https://nodejs.org/
```

### 2. **MongoDB** (Required)

**Option A: Install MongoDB Locally**

**macOS:**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows/Linux:**
Download from: https://www.mongodb.com/try/download/community

**Option B: Use MongoDB Atlas (Cloud - FREE)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `.env` file with:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ointment-booking
   ```

---

## 🛠️ Setup Instructions

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
The `.env` file is already created. Update if needed:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ointment-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Seed the Database (Optional)
Creates sample data for testing:
```bash
npm run seed
```

**Sample Accounts Created:**
- **Professional**: `dr.smith@ointmentpro.com` / `password123`
- **Client**: `client1@example.com` / `password123`

### Step 4: Start the Application

**Option A: Run Both Together (Recommended)**
```bash
npm run dev:full
```

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

### Step 5: Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 📁 Project Structure

```
PROJECT SEM4/
├── server/                      # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.ts               # MongoDB connection
│   ├── models/                 # MongoDB schemas
│   │   ├── User.ts            # User model
│   │   ├── Professional.ts    # Professional profile
│   │   ├── Service.ts         # Service catalog
│   │   ├── TimeSlot.ts        # Available time slots
│   │   └── Booking.ts         # Booking records
│   ├── routes/                 # API endpoints
│   │   ├── auth.ts            # Authentication
│   │   ├── professionals.ts   # Professional management
│   │   ├── services.ts        # Service management
│   │   ├── timeSlots.ts       # Time slot management
│   │   └── bookings.ts        # Booking management
│   ├── middleware/
│   │   └── auth.ts            # JWT authentication
│   ├── server.ts              # Main server file
│   └── seed.ts                # Database seeding
├── src/                        # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── Auth.tsx           # Login/Register
│   │   ├── ClientDashboard.tsx # Client interface
│   │   ├── ProfessionalDashboard.tsx # Professional interface
│   │   └── Header.tsx         # Navigation
│   ├── contexts/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── lib/
│   │   └── api.ts             # API client utility
│   ├── App.tsx                # Main app
│   └── main.tsx               # Entry point
├── .env                        # Environment variables
├── package.json
├── README.md                   # Full documentation
└── QUICKSTART.md              # Quick start guide
```

---

## 🎨 Features

### For Clients
✅ Browse all professionals with ratings  
✅ Filter by specialty, service, and date  
✅ View real-time availability  
✅ Book appointments instantly  
✅ Manage bookings (view, cancel)  
✅ Track booking status  
✅ View service prices  

### For Professionals
✅ Complete profile management  
✅ Add/edit/delete time slots  
✅ View all bookings  
✅ Confirm/cancel/complete bookings  
✅ Track revenue  
✅ Manage services offered  
✅ View client information  

### Technical Features
✅ JWT authentication  
✅ Role-based access control  
✅ RESTful API design  
✅ MongoDB with Mongoose ODM  
✅ Password hashing with bcrypt  
✅ Protected routes  
✅ Input validation  
✅ Error handling  
✅ Responsive design  
✅ Professional UI/UX  

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile

### Professionals
- `GET /api/professionals` - List all
- `GET /api/professionals/specialties` - Get specialties
- `GET /api/professionals/:id` - Get by ID
- `GET /api/professionals/my-profile` - My profile
- `PUT /api/professionals/my-profile` - Update profile

### Services
- `GET /api/services` - List all
- `GET /api/services/categories` - Categories
- `POST /api/services` - Create
- `PUT /api/services/:id` - Update
- `DELETE /api/services/:id` - Deactivate

### Time Slots
- `GET /api/time-slots/professional/:id` - Get slots
- `POST /api/time-slots` - Create
- `PUT /api/time-slots/:id` - Update
- `DELETE /api/time-slots/:id` - Delete

### Bookings
- `GET /api/bookings/my-bookings` - Client bookings
- `GET /api/bookings/professional/bookings` - Professional bookings
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id/status` - Update status
- `PUT /api/bookings/:id/cancel` - Cancel booking

---

## 🧪 Testing Guide

### Test Scenario 1: Client Booking
1. Login as client: `client1@example.com` / `password123`
2. Browse professionals
3. Filter by specialty
4. Click "View Available Slots"
5. Select a time slot
6. Choose a service
7. Add notes (optional)
8. Confirm booking
9. View in "My Bookings"

### Test Scenario 2: Professional Management
1. Login as professional: `dr.smith@ointmentpro.com` / `password123`
2. Update profile (specialty, bio, rate)
3. Add new time slots
4. View incoming bookings
5. Confirm a booking
6. Mark as completed

### Test Scenario 3: Full Workflow
1. Professional creates availability
2. Client books a slot
3. Professional confirms
4. Both view confirmed booking
5. Professional completes appointment

---

## 🐛 Troubleshooting

### MongoDB Not Running
**Error**: `Error connecting to MongoDB`

**Solution**:
```bash
# Start MongoDB (macOS)
brew services start mongodb-community

# Or check status
brew services list | grep mongodb
```

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill

# Or change PORT in .env
PORT=5001
```

### Missing Environment Variables
**Error**: `MONGODB_URI is not defined`

**Solution**: Ensure `.env` file exists with all required variables

### Module Not Found
**Error**: `Cannot find module 'xxx'`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- **README.md** - Complete documentation with detailed guides
- **QUICKSTART.md** - 5-minute setup guide
- **API Documentation** - See endpoints above

---

## 🎯 Next Steps

1. **Install MongoDB** (if not already installed)
2. **Run the application**: `npm run dev:full`
3. **Seed database**: `npm run seed` (optional)
4. **Test with sample accounts**
5. **Customize** colors, features, and branding
6. **Deploy** to production (Heroku, Vercel, AWS)

---

## 💡 Pro Tips

- Use **MongoDB Compass** for database visualization
- Test with **Postman** for API testing
- Check **browser console** for frontend errors
- Use **React DevTools** for debugging
- Monitor **server logs** for backend errors

---

## 🌟 Key Differences from Previous Version

| Feature | Old (Supabase) | New (MongoDB) |
|---------|---------------|---------------|
| Database | PostgreSQL | MongoDB |
| Auth | Supabase Auth | JWT Custom Auth |
| Client | Supabase SDK | REST API |
| Data Structure | Tables & Relations | Documents & References |
| Queries | SQL-like | Mongoose ODM |
| Deployment | Supabase Cloud | Self-hosted/Atlas |

---

## 🎉 Success Checklist

- ✅ MongoDB models created
- ✅ Express server configured
- ✅ JWT authentication implemented
- ✅ All API routes created
- ✅ Frontend migrated to REST API
- ✅ Professional UI redesign
- ✅ Environment configuration
- ✅ Documentation complete
- ✅ Seed script for testing
- ✅ Ready to run!

---

**Your professional ointment booking system is ready! 🚀**

Just install MongoDB, run `npm run dev:full`, and start booking!
