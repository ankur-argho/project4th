# Quick Start Guide - OintmentPro Booking System

## 🚀 Get Started in 5 Minutes

### Project Structure
- **`frontend/`**: React + Vite client (UI)
- **`backend/`**: Express + MongoDB API (server)
- **`api/`**: Vercel serverless entry that points to the backend app

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Or start manually
mongod
```

### Step 3: Set Up Environment Variables
The `.env` file is already created with default values. You can modify it if needed:
```env
MONGODB_URI=mongodb://localhost:27017/ointment-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 4: Seed the Database (Optional but Recommended)
This will create sample data for testing:
```bash
npm run seed
```

This creates:
- ✅ 4 pre-defined services
- ✅ 3 professional accounts
- ✅ 2 client accounts
- ✅ 10 available time slots

**Test Credentials:**
- **Professional**: `dr.smith@ointmentpro.com` / `password123`
- **Client**: `client1@example.com` / `password123`

### Step 5: Start the Application
```bash
# Run both backend and frontend together
npm run dev:full

# OR run them separately in different terminals
npm run server    # Terminal 1 - Backend
npm run client    # Terminal 2 - Frontend
```

### Step 6: Open in Browser
Navigate to: **http://localhost:5173**

---

## 🎯 What to Test

### As a Client:
1. **Login** with `client1@example.com` / `password123`
2. **Browse professionals** - See the list of available doctors
3. **Filter by specialty** - Use the dropdown to filter
4. **View time slots** - Click "View Available Slots" on any professional
5. **Book an appointment** - Click "Book Now" on a time slot
6. **View bookings** - Go to "My Bookings" tab to see your appointments
7. **Cancel a booking** - Click the "Cancel" button on a pending booking

### As a Professional:
1. **Login** with `dr.smith@ointmentpro.com` / `password123`
2. **Update profile** - Add your bio, specialty, and hourly rate
3. **Add time slots** - Create new available times for clients
4. **View bookings** - See incoming booking requests
5. **Manage bookings** - Confirm, cancel, or complete appointments

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error connecting to MongoDB
```
**Solution:**
```bash
# Check if MongoDB is installed
mongod --version

# Start MongoDB
brew services start mongodb-community
```

### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill

# Or change the PORT in .env file
PORT=5001
```

### Issue: Module Not Found
```
Cannot find module 'xxx'
```
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors
```
TS2307: Cannot find module
```
**Solution:**
```bash
# Regenerate TypeScript declarations
npm run build
```

---

## 📱 Testing the Application

### Test Flow 1: Client Booking
1. Login as client
2. Browse professionals
3. Select a professional
4. Choose a time slot
5. Select a service
6. Add notes (optional)
7. Confirm booking
8. View in "My Bookings"

### Test Flow 2: Professional Management
1. Login as professional
2. Update profile information
3. Add new time slots
4. View incoming bookings
5. Confirm a booking
6. Mark as completed after appointment

### Test Flow 3: Full Cycle
1. Professional adds time slots
2. Client books a time slot
3. Professional confirms the booking
4. Both can view the confirmed appointment
5. Professional marks as completed

---

## 🎨 Features to Explore

### Client Features:
- ✅ Real-time professional listings
- ✅ Advanced filtering (specialty, service, date)
- ✅ Instant booking creation
- ✅ Booking status tracking
- ✅ Professional ratings and reviews
- ✅ Service selection and pricing

### Professional Features:
- ✅ Profile customization
- ✅ Time slot management
- ✅ Booking approval workflow
- ✅ Client information viewing
- ✅ Revenue tracking
- ✅ Availability calendar

### Technical Features:
- ✅ JWT authentication
- ✅ Protected API routes
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive design
- ✅ Real-time updates

---

## 📊 API Testing with cURL

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "role": "client"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get All Professionals
```bash
curl http://localhost:5000/api/professionals
```

### Get Services
```bash
curl http://localhost:5000/api/services
```

---

## 🎓 Next Steps

1. **Customize the UI**: Modify colors and styling in `tailwind.config.js`
2. **Add More Features**: Email notifications, payment integration, etc.
3. **Deploy**: Set up on Heroku, Vercel, or AWS
4. **Add Tests**: Write unit and integration tests
5. **Documentation**: Add API documentation with Swagger

---

## 💡 Tips

- Use the seeded data to quickly test all features
- Try booking with different users to see the full workflow
- Check the browser console for any errors during testing
- Use MongoDB Compass to visualize the database
- Test on mobile devices for responsive design

---

**Need Help?** Check the main README.md for detailed documentation!
