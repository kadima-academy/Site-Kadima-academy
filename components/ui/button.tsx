import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "gold", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 rounded-lg border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-[#C9A97A] border-[#C9A97A] text-[#060D1F] hover:bg-[#E8D5A8] hover:border-[#E8D5A8]": variant === "gold",
            "bg-transparent border-[rgba(201,169,122,0.25)] text-[#C9A97A] hover:bg-[rgba(201,169,122,0.08)]": variant === "ghost",
            "bg-red-900/30 border-red-700/40 text-red-400 hover:bg-red-900/50": variant === "danger",
          },
          {
            "px-3 py-1.5 text-xs": size === "sm",
            "px-5 py-2.5 text-sm": size === "md",
            "px-8 py-3.5 text-base": size === "lg",
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export { Button };
