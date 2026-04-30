// In dev, Vite proxies `/api` to the backend (see `vite.config.ts`).
// In production, set `VITE_API_URL` to your backend origin + `/api` (or serve the API at the same origin).
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://ointment-booking-backend-production.up.railway.app/api' : '/api');

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'client' | 'professional';
}

export type ProfessionalType = 'doctor' | 'tutor' | 'consultant';

export interface Professional {
  _id: string;
  userId: User;
  type: ProfessionalType;
  specialty: string;
  bio: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  services?: Service[];
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  providerType: 'any' | ProfessionalType;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  _id: string;
  professionalId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  clientId: User;
  professionalId: Professional;
  serviceId: Service;
  timeSlotId: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    let response: Response;
    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (e: unknown) {
      // Most commonly: backend isn't running, bad base URL, or CORS/network failure.
      throw new Error(
        'Failed to fetch. Make sure the backend API is running (try `npm run dev:full` or `npm run server`).'
      );
    }

    const text = await response.text();
    let data: { error?: string } & Record<string, unknown>;
    try {
      data = text ? (JSON.parse(text) as typeof data) : {};
    } catch {
      if (response.status === 504 || text.includes('FUNCTION_INVOCATION_TIMEOUT')) {
        throw new Error(
          'Server timed out while connecting to the database. In MongoDB Atlas: resume the cluster if it is paused, allow Network Access (for example 0.0.0.0/0 for class projects), verify MONGODB_URI on Vercel, then redeploy.'
        );
      }
      const preview = text.slice(0, 160).replace(/\s+/g, ' ').trim();
      throw new Error(
        preview
          ? `Server did not return JSON (${response.status}): ${preview}`
          : `Empty response from server (${response.status})`
      );
    }

    if (!response.ok) {
      throw new Error((typeof data.error === 'string' && data.error) || 'Request failed');
    }

    return data as T;
  }

  // Auth
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    role: 'client' | 'professional';
    professionalType?: ProfessionalType;
  }) {
    const result = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(result.token);
    return result;
  }

  async getProfile() {
    return this.request<User>('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // Professionals
  async getProfessionals(params?: { specialty?: string; search?: string }) {
    const q = new URLSearchParams();
    if (params?.specialty) q.set('specialty', params.specialty);
    if (params?.search) q.set('search', params.search);
    const queryString = q.toString();
    return this.request<Professional[]>(`/professionals${queryString ? `?${queryString}` : ''}`);
  }

  async getSpecialties() {
    return this.request<string[]>('/professionals/specialties');
  }

  async getProfessional(id: string) {
    return this.request<Professional>(`/professionals/${id}`);
  }

  async getMyProfessionalProfile() {
    return this.request<Professional>('/professionals/my-profile');
  }

  async updateProfessionalProfile(data: {
    specialty?: string;
    bio?: string;
    hourlyRate?: number;
    type?: ProfessionalType;
  }) {
    return this.request<Professional>('/professionals/my-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Services
  async getServices(params?: { category?: string; isActive?: boolean; providerType?: ProfessionalType }) {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.isActive !== undefined) q.set('isActive', params.isActive ? 'true' : 'false');
    if (params?.providerType) q.set('providerType', params.providerType);
    const queryString = q.toString();
    return this.request<Service[]>(`/services${queryString ? `?${queryString}` : ''}`);
  }

  async getServiceCategories() {
    return this.request<string[]>('/services/categories');
  }

  async createService(data: {
    name: string;
    description: string;
    category: string;
    durationMinutes: number;
    price: number;
  }) {
    return this.request<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Time Slots
  async getTimeSlots(professionalId: string, params?: { date?: string; isAvailable?: boolean }) {
    const q = new URLSearchParams();
    if (params?.date) q.set('date', params.date);
    if (params?.isAvailable !== undefined) q.set('isAvailable', params.isAvailable ? 'true' : 'false');
    const queryString = q.toString();
    return this.request<TimeSlot[]>(
      `/time-slots/professional/${professionalId}${queryString ? `?${queryString}` : ''}`
    );
  }

  async createTimeSlot(data: {
    professionalId: string;
    startTime: string;
    endTime: string;
  }) {
    return this.request<TimeSlot>('/time-slots', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteTimeSlot(id: string) {
    return this.request<{ message: string }>(`/time-slots/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings
  async getMyBookings() {
    return this.request<Booking[]>('/bookings/my-bookings');
  }

  async getProfessionalBookings() {
    return this.request<Booking[]>('/bookings/professional/bookings');
  }

  async createBooking(data: {
    professionalId: string;
    serviceId: string;
    timeSlotId: string;
    notes?: string;
  }) {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') {
    return this.request<Booking>(`/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async cancelBooking(bookingId: string) {
    return this.request<Booking>(`/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
  }
}

export const api = new ApiClient();
