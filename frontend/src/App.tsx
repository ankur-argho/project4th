import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { Header } from './components/Header';
import { ClientDashboard } from './components/ClientDashboard';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { PageFadeIn } from './components/ui/Motion';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="bg-primary flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-brand-500" />
        <p className="text-secondary text-sm font-medium">Signing you in…</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="bg-primary min-h-screen">
      <Header />
      <main className="pb-16">
        <PageFadeIn>{user.role === 'professional' ? <ProfessionalDashboard /> : <ClientDashboard />}</PageFadeIn>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
