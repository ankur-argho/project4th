import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/Button';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-700/40 bg-card/90 shadow-ui backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-ui">
            <CalendarDays size={22} strokeWidth={2} />
          </div>
          <div>
            <p className="text-primary text-base font-semibold tracking-tight">OintmentPro</p>
            <p className="text-muted hidden text-xs sm:block">Scheduling for professionals</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          {user && (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-primary text-sm font-semibold">{user.fullName}</p>
                <p className="text-xs capitalize text-primary-500">{user.role}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={signOut}
                className="px-3 py-2 text-sm sm:px-4"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
