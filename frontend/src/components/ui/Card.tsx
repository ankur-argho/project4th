import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

type CardProps = Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps> &
  MotionProps & {
    children: ReactNode;
    interactive?: boolean;
  };

export function Card({ className = '', interactive = false, children, ...props }: CardProps) {
  return (
    <motion.div
      className={`ui-card ${className}`.trim()}
      {...(interactive
        ? {
            whileHover: { y: -4 },
            transition: { duration: 0.22 },
          }
        : undefined)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
