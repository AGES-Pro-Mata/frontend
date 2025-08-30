import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
}

export const HeaderButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(({ className, secondary, children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn(
        "rounded-full px-6 py-2 font-semibold transition-all duration-300 shadow-sm",
        "hover:scale-105 hover:shadow-md",
        secondary
          ? "border border-[var(--button-border-secondary)] bg-transparent text-[var(--button-text-secondary)] hover:bg-[var(--button-bg-secondary-hover)]"
          : "bg-[var(--button-bg-primary)] text-[var(--button-text-primary)] hover:bg-[var(--button-bg-primary-hover)]",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

HeaderButton.displayName = "HeaderButton";
