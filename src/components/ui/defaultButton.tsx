import { Button } from "@/components/ui/button";
import type React from "react";

interface DefaultButtonProps {
  label: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export { DefaultButton as Button };
export function DefaultButton({
  label,
  variant = "primary",
  onClick,
  className,
  type = "button",
  ...props
}: DefaultButtonProps) {
  const base = "transition-colors duration-150 px-4 py-2 rounded-md";

  const styles = {
    primary:
      "shadow-sm bg-contrast-green text-white hover:bg-contrast-green/90 active:bg-contrast-green/70",
    secondary:
      "shadow-sm bg-banner text-on-banner-text border border-banner hover:bg-banner/90 active:bg-banner/70 hover:border-banner",
    ghost:
      "bg-transparent text-on-banner-text border-transparent transition-colors duration-150 hover:bg-banner/10 active:bg-banner/20",
  } as const;

  return (
    <Button
      type={type}
      variant="ghost"
      className={`${base} ${styles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {label}
    </Button>
  );
}
