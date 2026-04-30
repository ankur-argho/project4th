import { useState, useEffect } from 'react';
import { api, Professional, Service, TimeSlot, Booking, ProfessionalType } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { SupportChat } from './SupportChat';
import { AnimatePresence, motion } from 'framer-motion';
import { StatusBadge } from './ui/StatusBadge';
import { Card } from './ui/Card';

export function ProfessionalDashboard() {
  const { user } = useAuth();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'availability' | 'bookings'>('profile');
  const [loading, setLoading] = useState(true);

  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState(0);
  const [professionalType, setProfessionalType] = useState<ProfessionalType>('doctor');

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  useEffect(() => {
    fetchProfessionalData();
  }, [user]);

  const fetchProfessionalData = async () => {
    if (!user) return;

    try {
      const profData = await api.getMyProfessionalProfile();
      const profType = profData.type ?? 'doctor';
      const servicesData = await api.getServices({
        isActive: true,
        providerType: profType,
      });

      setProfessional(profData);
      setProfessionalType(profType);
      setSpecialty(profData.specialty);
      setBio(profData.bio);
      setHourlyRate(profData.hourlyRate);

      const slots = await api.getTimeSlots(profData._id);
      setTimeSlots(slots);

      const bookingsData = await api.getProfessionalBookings();
      setBookings(bookingsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Error fetching professional data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!professional) {
      alert('Profile is still loading. Please wait and try again.');
      return;
    }

    try {
      await api.updateProfessionalProfile({
        type: professionalType,
        specialty,
        bio,
        hourlyRate,
      });

      alert('Profile updated successfully!');
      fetchProfessionalData();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Failed to update profile');
    }
  };

  const addTimeSlot = async () => {
    if (!professional || !selectedDate || !selectedTime || !selectedService) {
      alert('Please fill all fields');
      return;
    }

    try {
      const service = services.find((s) => s._id === selectedService);
      if (!service) return;

      const startTime = new Date(`${selectedDate}T${selectedTime}`);
      const endTime = new Date(startTime.getTime() + service.durationMinutes * 60000);

      await api.createTimeSlot({
        professionalId: professional._id,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      alert('Time slot added successfully!');
      setSelectedDate('');
      setSelectedTime('');
      setSelectedService('');
      fetchProfessionalData();
    } catch (error: any) {
      console.error('Error adding time slot:', error);
      alert(error.message || 'Failed to add time slot');
    }
  };

  const deleteTimeSlot = async (timeSlotId: string) => {
    try {
      await api.deleteTimeSlot(timeSlotId);
      alert('Time slot deleted successfully!');
      fetchProfessionalData();
    } catch (error: any) {
      console.error('Error deleting time slot:', error);
      alert(error.message || 'Failed to delete time slot');
    }
  };

  const updateBookingStatus = async (
    bookingId: string,
    status: 'confirmed' | 'cancelled' | 'completed'
  ) => {
    try {
      await api.updateBookingStatus(bookingId, status);
      alert('Booking status updated!');
      fetchProfessionalData();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      alert(error.message || 'Failed to update booking status');
    }
  };

  // UI-only: centralized badge styling in StatusBadge component

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
        <p className="text-secondary text-sm font-medium">Loading your workspace…</p>
      </div>
    );
  }

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const now = new Date();
  const upcomingStatuses = new Set(['pending', 'confirmed']);
  const upcomingTodayCount = bookings.filter((b) => {
    const start = new Date(b.timeSlotId?.startTime);
    return (
      upcomingStatuses.has(b.status) &&
      !Number.isNaN(start.getTime()) &&
      isSameDay(start, now) &&
      start.getTime() >= now.getTime()
    );
  }).length;
  const upcomingCount = bookings.filter((b) => upcomingStatuses.has(b.status)).length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">Professional</p>
        <Card className="mt-4 p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-primary text-2xl font-semibold tracking-tight sm:text-3xl">
                Welcome back, {user?.fullName ?? 'there'} 👋
              </h1>
              <p className="text-secondary mt-2">
                You have <span className="text-primary font-semibold">{upcomingTodayCount}</span> upcoming booking
                {upcomingTodayCount === 1 ? '' : 's'} today.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-[22rem]">
              <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-700/70 dark:bg-slate-900/30">
                <p className="text-muted text-xs font-semibold uppercase tracking-wide">Upcoming</p>
                <p className="text-primary mt-1 text-2xl font-semibold tabular-nums">{upcomingCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/50 p-4 dark:border-slate-700/70 dark:bg-slate-900/30">
                <p className="text-muted text-xs font-semibold uppercase tracking-wide">Completed</p>
                <p className="text-primary mt-1 text-2xl font-semibold tabular-nums">{completedCount}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="ui-card overflow-hidden shadow-ui-md">
        <div className="bg-secondary flex flex-wrap border-b border-slate-700/40 dark:border-slate-700/70 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`ui-tab ${activeTab === 'profile' ? 'ui-tab-active' : ''}`}
          >
            <User size={18} />
            Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('availability')}
            className={`ui-tab ${activeTab === 'availability' ? 'ui-tab-active' : ''}`}
          >
            <Calendar size={18} />
            Availability
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`ui-tab ${activeTab === 'bookings' ? 'ui-tab-active' : ''}`}
          >
            <CheckCircle size={18} />
            Bookings
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
                className="mx-auto max-w-xl space-y-6"
              >
              <div className="rounded-xl border border-slate-200/80 bg-slate-100/60 p-5 dark:border-slate-700/70 dark:bg-slate-900/50">
                <label className="ui-label">Professional type</label>
                <select
                  value={professionalType}
                  onChange={(e) => setProfessionalType(e.target.value as ProfessionalType)}
                  className="ui-input"
                >
                  <option value="doctor">Doctor</option>
                  <option value="tutor">Tutor</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
              <div>
                <label className="ui-label">Specialty</label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="ui-input"
                  placeholder="e.g. Frontend tutoring"
                />
              </div>

              <div>
                <label className="ui-label">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="ui-input min-h-[120px] resize-y"
                  rows={4}
                  placeholder="Credentials, approach, and what clients can expect."
                />
              </div>

              <div>
                <label className="ui-label">Hourly rate ($)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="ui-input"
                  min="0"
                  step="0.01"
                />
              </div>

              <button type="button" onClick={updateProfile} className="ui-btn-primary w-full py-3">
                Save profile
              </button>
              </motion.div>
            )}

            {activeTab === 'availability' && (
              <motion.div
                key="availability"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
                className="space-y-10"
              >
              <section className="bg-secondary rounded-2xl border border-slate-200/80 p-6 dark:border-slate-700/70 dark:bg-slate-900/40">
                <h3 className="text-primary mb-6 text-lg font-semibold">Add time slot</h3>
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="ui-label">Service</label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="ui-input"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service._id} value={service._id}>
                          {service.name} ({service.durationMinutes} min)
                        </option>
                      ))}
                    </select>
                    {services.length === 0 && (
                      <p className="mt-2 text-sm leading-relaxed text-amber-700 dark:text-amber-300">
                        No services for your professional type yet. Confirm <strong>Profile → Professional type</strong>,
                        save, refresh, or restart the API once so core services seed.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="ui-label">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="ui-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="ui-label">Start time</label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="ui-input"
                    />
                  </div>
                </div>
                <button type="button" onClick={addTimeSlot} className="ui-btn-primary w-full py-3">
                  Add slot
                </button>
              </section>

              <section>
                <h3 className="text-primary mb-4 text-lg font-semibold">Your schedule</h3>
                <div className="max-h-[28rem] space-y-3 overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot._id}
                    className="bg-secondary dark:bg-slate-900/45 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200/80 px-4 py-4 shadow-sm dark:border-slate-700/70"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-brand-600" />
                        <div>
                          <p className="text-primary font-medium">
                            {new Date(slot.startTime).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-secondary flex items-center gap-1 text-sm">
                            <Clock size={14} />
                            {new Date(slot.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            –{' '}
                            {new Date(slot.endTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={slot.isAvailable ? 'open' : 'booked'} className="px-3 py-1 text-xs" />
                        {slot.isAvailable && (
                          <button
                            type="button"
                            onClick={() => deleteTimeSlot(slot._id)}
                            className="rounded-lg p-2 text-rose-600 transition-colors hover:bg-rose-50"
                            aria-label="Remove slot"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {timeSlots.length === 0 && (
                    <p className="text-muted rounded-xl border border-dashed border-slate-300 bg-slate-100 py-12 text-center text-sm dark:border-slate-700 dark:bg-slate-900/40">
                      No slots yet. Add your first availability above.
                    </p>
                  )}
                </div>
              </section>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
              >
              <h3 className="text-primary mb-6 text-lg font-semibold">Incoming requests</h3>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <article
                    key={booking._id}
                    className="bg-secondary dark:bg-slate-900/45 rounded-2xl border border-slate-200/80 p-6 shadow-sm transition-shadow hover:shadow-ui dark:border-slate-700/70"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-primary font-semibold">{booking.clientId.fullName}</h4>
                          <StatusBadge status={booking.status} />
                        </div>
                        <dl className="text-secondary space-y-1 text-sm">
                          <div>
                            <span className="text-primary font-medium">Service:</span> {booking.serviceId.name}
                          </div>
                          <div>
                            <span className="text-primary font-medium">Time:</span>{' '}
                            {new Date(booking.timeSlotId.startTime).toLocaleString()}
                          </div>
                          <div>
                            <span className="text-primary font-medium">Amount:</span>{' '}
                            <span className="font-semibold text-emerald-700">${booking.totalAmount}</span>
                          </div>
                          {booking.notes && (
                            <div className="text-secondary">
                              <span className="text-primary font-medium">Notes:</span> {booking.notes}
                            </div>
                          )}
                        </dl>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="ui-btn-primary px-5 py-2 text-sm"
                            >
                              <CheckCircle size={16} />
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="ui-btn-secondary border-rose-200 text-rose-700 hover:bg-rose-50"
                            >
                              <XCircle size={16} />
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => updateBookingStatus(booking._id, 'completed')}
                            className="ui-btn-primary px-5 py-2 text-sm"
                          >
                            <CheckCircle size={16} />
                            Mark complete
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
                {bookings.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                    <AlertCircle className="text-muted mx-auto mb-4 h-14 w-14" strokeWidth={1.25} />
                    <p className="text-primary font-medium">No bookings yet</p>
                    <p className="text-muted mt-1 text-sm">New client requests will appear here.</p>
                  </div>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <SupportChat />
    </div>
  );
}
