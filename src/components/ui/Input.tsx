import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gempala-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-2xl border border-gempala-border bg-gempala-surface px-4 py-2 text-base ring-offset-gempala-surface file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gempala-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gempala-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
            error && "border-gempala-danger focus-visible:ring-gempala-danger",
            className
          )}
          {...props}
        />
        {error && <span className="text-sm text-gempala-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
