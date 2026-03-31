import React from 'react';
import { cn } from './Card';

const badgeVariants = {
  active: "bg-green-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
  paused: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800",
  draft: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
  default: "bg-primary/10 text-primary dark:bg-primary/20",
};

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none",
        badgeVariants[variant] || badgeVariants.default,
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}
