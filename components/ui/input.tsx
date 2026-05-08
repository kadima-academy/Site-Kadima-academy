import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs tracking-widest uppercase text-[rgba(255,255,255,0.5)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,122,0.2)] rounded-lg px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.25)] outline-none transition-all",
            "focus:border-[rgba(201,169,122,0.55)] focus:bg-[rgba(255,255,255,0.06)]",
            error && "border-red-500/50",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
export { Input };
