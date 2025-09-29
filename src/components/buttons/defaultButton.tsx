import { Button } from "@/components/ui/button";
import type React from "react";

interface DefaultButtonProps {
  label: React.ReactNode;
  variant?: "primary" | "secondary" | "gray" | "ghost" | "destructive";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export { DefaultButton as Button };
export function DefaultButton({
  label,
  variant = "primary",
  onClick,
  className,
  type = "button",
  disabled = false,
  ...props
}: DefaultButtonProps) {
  const base = "w-fit font-semibold transition-colors duration-150 px-3 py-4 rounded-[5px] hover:cursor-pointer select-none text-md p-5";

  const styles = {
    primary:
      "shadow-sm bg-contrast-green text-white hover:bg-contrast-green/90 active:bg-contrast-green/70",
    secondary:
      "shadow-sm bg-banner text-on-banner-text hover:bg-banner/90 active:bg-banner/70 hover:border-banner",
    gray:
      "shadow-sm bg-dark-gray text-white hover:bg-dark-gray/90 active:bg-dark-gray/70",
    destructive:
      "shadow-sm bg-default-red text-white hover:bg-default-red/90 active:bg-default-red/70",
    ghost:
      "bg-transparent text-on-banner-text border-transparent transition-colors duration-150 hover:bg-banner/10 active:bg-banner/20",
  } as const;

  return (
    <Button
      type={type}
      variant="ghost"
      className={`${base} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {label}
    </Button>
  );
}
