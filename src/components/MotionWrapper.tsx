import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ReactNode } from 'react';

interface MotionWrapperProps {
  children: ReactNode;
  variants?: any;
  initial?: string;
  animate?: string;
  exit?: string;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  [key: string]: any;
}

export const MotionWrapper = ({ 
  children, 
  variants, 
  initial = "hidden", 
  animate = "visible", 
  exit,
  className,
  whileHover,
  whileTap,
  ...props 
}: MotionWrapperProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      whileHover={whileHover}
      whileTap={whileTap}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};