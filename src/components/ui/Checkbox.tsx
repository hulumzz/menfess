import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={checkboxId}
            ref={ref}
            className={cn(
              "peer appearance-none h-6 w-6 rounded-md border-2 border-gempala-border bg-gempala-surface checked:bg-gempala-accent checked:border-gempala-accent transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gempala-accent focus-visible:ring-offset-2",
              className
            )}
            {...props}
          />
          <Check className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" strokeWidth={3} />
        </div>
        <label htmlFor={checkboxId} className="text-base font-medium cursor-pointer select-none">
          {label}
        </label>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
