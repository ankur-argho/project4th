import { useMemo, useState } from 'react';
import { HelpCircle, Sparkles, X } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

type QA = { q: string; a: string };

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const faqs: QA[] = useMemo(
    () => [
      {
        q: 'Why is the service list empty?',
        a: 'The API must be running and MongoDB must contain services. Run locally with `npm run dev:full`, or deploy with `MONGODB_URI` set on Vercel and restart once so core services seed.',
      },
      {
        q: 'Deploying on Vercel',
        a: 'Add env vars: `MONGODB_URI`, `JWT_SECRET`, and optionally `CORS_ORIGIN`. Build runs `vite build`; API lives in `/api` via serverless. Use MongoDB Atlas for the database.',
      },
      {
        q: 'Port 5000 in use locally',
        a: 'Stop the old server (Ctrl+C) or run `PORT=5001 npm run server` and set `VITE_API_PROXY_TARGET=http://localhost:5001` when running the Vite client.',
      },
      {
        q: 'Tutor account — which services appear?',
        a: 'Services are filtered by your professional type (doctor / tutor / consultant). Update My Profile if needed, save, then refresh.',
      },
    ],
    []
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full px-5 py-3 text-sm shadow-ui-lg"
        >
          <HelpCircle size={18} />
          Help
        </Button>
      ) : (
        <Card className="flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden shadow-ui-lg">
          <div className="flex items-center justify-between border-b border-slate-700/40 px-4 py-3 dark:border-slate-700/70">
            <div className="text-primary flex items-center gap-2 font-semibold">
              <Sparkles size={18} className="text-primary-500" />
              Quick help
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setOpen(false);
                setSelected(null);
              }}
              className="rounded-lg p-1"
              aria-label="Close"
            >
              <X size={18} />
            </Button>
          </div>

          <div className="max-h-[min(70vh,420px)] space-y-2 overflow-y-auto p-4">
            <p className="text-muted text-xs font-medium uppercase tracking-wide">Choose a topic</p>
            {faqs.map((item, idx) => (
              <button
                key={item.q}
                type="button"
                onClick={() => setSelected(idx)}
                className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  selected === idx
                    ? 'border-primary-500/50 bg-primary-500/10 text-primary'
                    : 'border-slate-200 bg-white/70 text-secondary hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:border-slate-600 dark:hover:bg-slate-800/80'
                }`}
              >
                <span className="font-semibold">{item.q}</span>
                {selected === idx && (
                  <p className="text-secondary mt-2 text-sm leading-relaxed">{item.a}</p>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
