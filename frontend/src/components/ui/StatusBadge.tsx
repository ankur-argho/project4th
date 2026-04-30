import type { HTMLAttributes } from 'react';

type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
type SlotStatus = 'open' | 'booked';

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  status: BookingStatus | SlotStatus | (string & {});
};

const classesByStatus: Record<string, string> = {
  confirmed:
    'bg-emerald-50 text-emerald-800 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20',
  pending:
    'bg-amber-50 text-amber-900 ring-amber-600/15 dark:bg-amber-500/10 dark:text-amber-200 dark:ring-amber-500/20',
  cancelled:
    'bg-rose-50 text-rose-800 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20',
  completed:
    'bg-slate-100 text-slate-700 ring-slate-500/15 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-400/20',
  open: 'bg-emerald-50 text-emerald-800 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/20',
  booked: 'bg-slate-100 text-slate-600 ring-slate-400/20 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-400/20',
};

export function StatusBadge({ status, className = '', ...props }: StatusBadgeProps) {
  const key = String(status).toLowerCase();
  const statusClasses =
    classesByStatus[key] ??
    'bg-slate-100 text-slate-700 ring-slate-500/15 dark:bg-slate-500/10 dark:text-slate-200 dark:ring-slate-400/20';

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${statusClasses} ${className}`.trim()}
      {...props}
    >
      {status}
    </span>
  );
}
