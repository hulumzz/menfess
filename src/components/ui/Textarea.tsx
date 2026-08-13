import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, maxLength, value, onChange, ...props }, ref) => {
    const charCount = typeof value === 'string' ? value.length : 0;
    
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-sm font-semibold text-gempala-secondary uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          className={cn(
            "flex min-h-[140px] w-full rounded-2xl border border-gempala-border bg-gempala-surface px-4 py-3 text-base ring-offset-gempala-surface placeholder:text-gempala-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gempala-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-y",
            error && "border-gempala-danger focus-visible:ring-gempala-danger",
            className
          )}
          {...props}
        />
        <div className="flex justify-between items-start mt-1">
          <div className="flex-1">
            {error && <span className="text-sm text-gempala-danger">{error}</span>}
          </div>
          {maxLength && (
            <span className={cn(
              "text-sm font-medium transition-colors",
              charCount >= maxLength ? "text-gempala-danger" : "text-gempala-secondary"
            )}>
              {charCount} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
