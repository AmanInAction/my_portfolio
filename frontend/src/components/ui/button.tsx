import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent-green)] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent-green)] text-[#080b0a] font-semibold hover:bg-[var(--accent-green-dim)] shadow-[0_0_12px_rgba(0,255,136,0.3)]",
        outline:
          "border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)] hover:bg-[rgba(0,255,136,0.08)]",
        secondary:
          "bg-[rgba(0,255,136,0.08)] text-[var(--text-primary)] border border-[rgba(0,255,136,0.2)] hover:border-[var(--accent-green)] hover:text-[var(--accent-green)]",
        ghost:
          "hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        link: "text-[var(--accent-green)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
