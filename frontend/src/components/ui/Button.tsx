import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

type Variant = 'primary' | 'secondary' | 'danger';

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> &
  MotionProps & {
  variant?: Variant;
  motionPreset?: 'none' | 'subtle';
  children: ReactNode;
};

const variantClassMap: Record<Variant, string> = {
  primary: 'ui-btn-primary',
  secondary: 'ui-btn-secondary',
  danger: 'ui-btn-danger',
};

const presets = {
  none: undefined,
  subtle: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.99 },
    transition: { duration: 0.22 },
  },
} as const;

export function Button({
  variant = 'primary',
  motionPreset = 'subtle',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const motionProps = presets[motionPreset];
  return (
    <motion.button className={`${variantClassMap[variant]} ${className}`.trim()} {...motionProps} {...props}>
      {children}
    </motion.button>
  );
}
