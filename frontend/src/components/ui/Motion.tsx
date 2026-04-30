import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function PageFadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}>
      {children}
    </motion.div>
  );
}
