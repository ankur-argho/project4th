import { useState, useEffect } from 'react';
import { api, Professional, Service, TimeSlot, Booking } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Search, Calendar, Clock, User, BookOpen, XCircle } from 'lucide-react';
import { SupportChat } from './SupportChat';
import { AnimatePresence, motion } from 'framer-motion';
import { StatusBadge } from './ui/StatusBadge';
import { Card } from './ui/Card';

export function ClientDashboard() {
  const { user } = useAuth();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [loading, setLoading] = useState(true);

  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (selectedProfessional) {
      fetchTimeSlots();
    }
  }, [selectedProfessional, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profsData, servicesData, specialtiesData] = await Promise.all([
        api.getProfessionals(),
        api.getServices({ isActive: true }),
        api.getSpecialties(),
      ]);

      setProfessionals(profsData);
      setServices(servicesData);
      setSpecialties(specialtiesData);

      if (user) {
        const bookingsData = await api.getMyBookings();
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedProfessional) return;

    try {
      const slots = await api.getTimeSlots(selectedProfessional._id, {
        date: selectedDate || undefined,
        isAvailable: true,
      });
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const filteredProfessionals = professionals.filter((prof) => {
    if (selectedSpecialty && prof.specialty !== selectedSpecialty) {
      return false;
    }
    if (selectedService && !prof.services?.some((s) => s._id === selectedService)) {
      return false;
    }
    return true;
  });

  const openBookingModal = (prof: Professional, slot: TimeSlot) => {
    setSelectedProfessional(prof);
    setSelectedTimeSlot(slot);
    setShowBookingModal(true);
  };

  const createBooking = async () => {
    if (!user || !selectedProfessional || !selectedTimeSlot || !selectedService) {
      alert('Please select a service');
      return;
    }

    try {
      await api.createBooking({
        professionalId: selectedProfessional._id,
        serviceId: selectedService,
        timeSlotId: selectedTimeSlot._id,
        notes: bookingNotes,
      });

      alert('Booking created successfully!');
      setShowBookingModal(false);
      setBookingNotes('');
      setSelectedTimeSlot(null);
      setSelectedProfessional(null);
      fetchData();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(error.message || 'Failed to create booking');
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await api.cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error cancelling booking:', error);
      alert(error.message || 'Failed to cancel booking');
    }
  };

  // UI-only: centralized badge styling in StatusBadge component

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
        <p className="text-secondary text-sm font-medium">Loading your dashboard…</p>
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
        <p className="text-primary-500 text-xs font-semibold uppercase tracking-wider">Client</p>
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
        <div className="bg-secondary flex border-b border-slate-700/40 dark:border-slate-700/70 dark:bg-slate-900/40">
          <button
            type="button"
            onClick={() => setActiveTab('browse')}
            className={`ui-tab ${activeTab === 'browse' ? 'ui-tab-active' : ''}`}
          >
            <Search size={18} />
            Browse
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`ui-tab ${activeTab === 'bookings' ? 'ui-tab-active' : ''}`}
          >
            <BookOpen size={18} />
            My bookings
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'browse' && (
              <motion.div
                key="browse"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.24 }}
              >
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="ui-label">Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="ui-input"
                  >
                    <option value="">All specialties</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="ui-label">Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="ui-input"
                  >
                    <option value="">All services</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
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
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {filteredProfessionals.map((prof) => (
                  <article
                    key={prof._id}
                    className="bg-secondary dark:bg-slate-900/45 flex flex-col rounded-2xl border border-slate-200/80 p-6 shadow-sm transition-shadow hover:shadow-ui-md dark:border-slate-700/70"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-700/60">
                      <div>
                        <h3 className="text-primary text-lg font-semibold">{prof.userId.fullName}</h3>
                        <p className="text-primary-500 mt-1 text-sm font-medium">{prof.specialty}</p>
                        <div className="text-secondary mt-2 flex items-center gap-1 text-sm">
                          <span className="text-amber-500">★</span>
                          <span className="font-medium">{prof.rating.toFixed(1)}</span>
                          <span className="text-muted">({prof.totalReviews} reviews)</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary text-2xl font-semibold tabular-nums">${prof.hourlyRate}</p>
                        <p className="text-muted text-xs">from / session</p>
                      </div>
                    </div>

                    {prof.bio && <p className="text-secondary mb-5 line-clamp-3 text-sm leading-relaxed">{prof.bio}</p>}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProfessional(prof);
                        fetchTimeSlots();
                      }}
                      className="ui-btn-primary w-full py-3"
                    >
                      View availability
                    </button>

                    {selectedProfessional?._id === prof._id && (
                      <div className="mt-6 border-t border-slate-200/80 pt-6 dark:border-slate-700/60">
                        <h4 className="text-primary mb-3 text-sm font-semibold">Open slots</h4>
                        {timeSlots.length > 0 ? (
                          <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
                            {timeSlots.map((slot) => (
                              <div
                                key={slot._id}
                                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-r from-white to-orange-50/60 px-4 py-3 dark:border-slate-700/70 dark:from-slate-900 dark:to-slate-800/70"
                              >
                                <div className="flex items-center gap-3">
                                  <Calendar size={18} className="text-brand-600" />
                                  <div>
                                      <p className="text-primary text-sm font-medium">
                                      {new Date(slot.startTime).toLocaleDateString(undefined, {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </p>
                                    <p className="text-secondary flex items-center gap-1 text-xs">
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
                                <button
                                  type="button"
                                  onClick={() => openBookingModal(prof, slot)}
                                  className="ui-btn-primary shrink-0 px-4 py-2 text-xs"
                                >
                                  Book
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted rounded-xl bg-slate-100/70 px-4 py-6 text-center text-sm dark:bg-slate-800/70">
                            No open slots for the selected date.
                          </p>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>

              {filteredProfessionals.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                  <User className="text-muted mx-auto mb-4 h-14 w-14" strokeWidth={1.25} />
                  <p className="text-primary font-medium">No professionals match your filters</p>
                  <p className="text-muted mt-1 text-sm">Try adjusting specialty or service.</p>
                </div>
              )}
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
              <h2 className="text-primary mb-6 text-lg font-semibold">Your bookings</h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <article
                    key={booking._id}
                    className="bg-secondary dark:bg-slate-900/45 rounded-2xl border border-slate-200/80 p-6 shadow-sm transition-shadow hover:shadow-ui dark:border-slate-700/70"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-primary font-semibold">{booking.professionalId.userId.fullName}</h3>
                          <StatusBadge status={booking.status} />
                        </div>
                        <dl className="text-secondary grid gap-1 text-sm">
                          <div>
                            <span className="text-primary font-medium">Service:</span> {booking.serviceId.name}
                          </div>
                          <div>
                            <span className="text-primary font-medium">Category:</span> {booking.serviceId.category}
                          </div>
                          <div>
                            <span className="text-primary font-medium">When:</span>{' '}
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
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          type="button"
                          onClick={() => cancelBooking(booking._id)}
                          className="ui-btn-danger shrink-0 self-start sm:self-center"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      )}
                    </div>
                  </article>
                ))}
                {bookings.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-100/50 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                    <Calendar className="text-muted mx-auto mb-4 h-14 w-14" strokeWidth={1.25} />
                    <p className="text-primary font-medium">No bookings yet</p>
                    <p className="text-muted mt-1 text-sm">Browse professionals to schedule your first session.</p>
                  </div>
                )}
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showBookingModal && selectedTimeSlot && selectedProfessional && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]">
          <div className="ui-card max-h-[90vh] w-full max-w-md overflow-y-auto p-6 shadow-ui-lg">
            <h2 className="text-primary text-xl font-semibold">Confirm booking</h2>
            <div className="mt-6 space-y-4 text-sm">
              <p className="flex items-start gap-2">
                <User size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span>
                  <span className="text-primary font-medium">Professional:</span>{' '}
                  {selectedProfessional.userId.fullName}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Calendar size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span>
                  <span className="text-primary font-medium">Date:</span>{' '}
                  {new Date(selectedTimeSlot.startTime).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
              <p className="flex items-start gap-2">
                <Clock size={18} className="mt-0.5 shrink-0 text-brand-600" />
                <span>
                  <span className="text-primary font-medium">Time:</span>{' '}
                  {new Date(selectedTimeSlot.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  –{' '}
                  {new Date(selectedTimeSlot.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </p>
              <div>
                <label className="ui-label">Service</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="ui-input"
                >
                  <option value="">Choose a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} — ${service.price}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ui-label">Notes (optional)</label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  className="ui-input min-h-[88px] resize-y"
                  placeholder="Anything the professional should know…"
                  rows={3}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
              <button type="button" onClick={createBooking} className="ui-btn-primary flex-1 py-3">
                Confirm booking
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingNotes('');
                  setSelectedTimeSlot(null);
                  setSelectedProfessional(null);
                }}
                className="ui-btn-secondary flex-1 py-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <SupportChat />
    </div>
  );
}
