import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, CheckCircle, Eye, EyeOff, LogIn, Search, ShieldCheck, Shield, Sparkles, UserPlus } from 'lucide-react';
import type { ProfessionalType } from '../lib/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [accountType, setAccountType] = useState<'client' | ProfessionalType>('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        const role = accountType === 'client' ? 'client' : 'professional';
        const professionalType = accountType === 'client' ? undefined : accountType;
        await signUp(email, password, fullName, role, professionalType);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Discover', body: 'Filter by specialty, service, and date.' },
    { title: 'Book', body: 'Reserve a slot that fits your calendar.' },
    { title: 'Meet', body: 'Get confirmations and updates in one place.' },
  ];

  const features = [
    { title: 'Clarity-first dashboards', body: 'Everything important, nothing extra.', icon: Sparkles },
    { title: 'Secure by default', body: 'JWT auth and role-based access.', icon: Shield },
  ] as const;

  const howItWorks = [
    { title: 'Search Professionals', body: 'Find verified experts based on your needs', icon: Search },
    { title: 'Book a Slot', body: 'Choose available time instantly', icon: CalendarDays },
    { title: 'Get Confirmation', body: 'Receive instant confirmation and updates', icon: CheckCircle },
  ] as const;

  return (
    <div className="bg-primary relative min-h-screen overflow-hidden">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(51, 65, 85, 0.35) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(51, 65, 85, 0.35) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-primary-500/25 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-12 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
        <div className="mb-12 max-w-xl lg:mb-0">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-ui-md">
              <CalendarDays size={26} />
            </div>
            <span className="text-primary text-xl font-semibold tracking-tight">OintmentPro</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24 }}
            className="text-primary text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            Appointment scheduling built for clarity.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.04 }}
            className="text-secondary mt-4 text-lg leading-relaxed"
          >
            Clients book verified slots; professionals manage availability and confirmations — without noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.08 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button type="button" onClick={() => setIsLogin(false)} className="px-6 py-3 text-base">
              Create an account
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsLogin(true)} className="px-6 py-3 text-base">
              Sign in
            </Button>
          </motion.div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-ui-md backdrop-blur-sm dark:border-white/15 dark:bg-white/5">
            <img
              src="/images/ointmentpro_landing_mockup.svg"
              alt="Dashboard preview"
              className="h-auto w-full rounded-xl border border-slate-100 object-cover"
            />
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} interactive className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/12 text-primary-500 ring-1 ring-primary-500/20">
                    <f.icon size={18} />
                  </div>
                  <div>
                    <p className="text-primary font-semibold">{f.title}</p>
                    <p className="text-secondary mt-1 text-sm">{f.body}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10">
            <div className="flex flex-col gap-1">
              <p className="text-primary text-base font-semibold">How it works</p>
              <p className="text-secondary text-sm">Book appointments in seconds with a simple flow</p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {howItWorks.map((item) => (
                <Card
                  key={item.title}
                  className="p-5 shadow-sm transition-all duration-300 hover:shadow-ui-md"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/12 text-primary-500 ring-1 ring-primary-500/20">
                      <item.icon size={18} />
                    </div>
                    <div>
                      <p className="text-primary font-semibold">{item.title}</p>
                      <p className="text-secondary mt-1 text-sm">{item.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-muted mt-8 flex items-center gap-2 text-sm">
            <ShieldCheck className="text-primary-500" size={18} />
            Secure sign-in · Role-based dashboards
          </div>
        </div>

        <Card className="w-full max-w-md p-8 shadow-ui-lg lg:shrink-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-primary text-2xl font-semibold tracking-tight">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </h2>
            <p className="text-secondary mt-2 text-sm">
              {isLogin ? 'Sign in to continue to your dashboard.' : 'Choose how you will use OintmentPro.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="ui-label">
                  Full name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="ui-input"
                  placeholder="Alex Morgan"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="ui-label">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ui-input"
                placeholder="you@company.com"
                autoComplete="username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="ui-label">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ui-input pr-11"
                  placeholder="••••••••"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 dark:text-slate-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} strokeWidth={1.75} /> : <Eye size={20} strokeWidth={1.75} />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="role" className="ui-label">
                  I am a
                </label>
                <select
                  id="role"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as 'client' | ProfessionalType)}
                  className="ui-input"
                >
                  <option value="client">Client — book appointments</option>
                  <option value="doctor">Doctor</option>
                  <option value="tutor">Tutor</option>
                  <option value="consultant">Consultant</option>
                </select>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full py-3">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Please wait…
                </span>
              ) : isLogin ? (
                <>
                  <LogIn size={18} />
                  Sign in
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create account
                </>
              )}
            </Button>
          </form>

          <p className="text-secondary mt-8 text-center text-sm">
            {isLogin ? "Don't have an account? " : 'Already registered? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setShowPassword(false);
              }}
              className="font-semibold text-primary-500 hover:text-primary-600"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
