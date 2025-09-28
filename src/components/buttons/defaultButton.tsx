import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DefaultButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "gray"
    | "ghost"
    | "destructive"
    | "outline";
  size?: "sm" | "md" | "lg" | "icon";
}

export { DefaultButton as Button };

const sizeClasses: Record<NonNullable<DefaultButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "size-10 p-0",
};

const variantClasses: Record<
  NonNullable<DefaultButtonProps["variant"]>,
  string
> = {
  primary:
    "bg-contrast-green text-white shadow-sm hover:bg-contrast-green/90 active:bg-contrast-green/70",
  secondary:
    "bg-banner text-on-banner-text shadow-sm hover:bg-banner/90 active:bg-banner/70",
  gray: "bg-dark-gray text-white shadow-sm hover:bg-dark-gray/90 active:bg-dark-gray/70",
  destructive:
    "bg-default-red text-white shadow-sm hover:bg-default-red/90 active:bg-default-red/70",
  outline:
    "border border-dark-gray text-dark-gray hover:bg-dark-gray/10 active:bg-dark-gray/20",
  ghost:
    "bg-transparent text-on-banner-text hover:bg-banner/10 active:bg-banner/20",
};

const DefaultButton = React.forwardRef<HTMLButtonElement, DefaultButtonProps>(
  (
    {
      label,
      variant = "primary",
      size = "md",
      className,
      type = "button",
      disabled = false,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-[5px] transition-colors duration-150 select-none whitespace-nowrap";
    const sizeCls = sizeClasses[size];
    const variantCls = variantClasses[variant];

    return (
      <Button
        ref={ref}
        type={type}
        variant="ghost"
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(base, sizeCls, variantCls, className)}
        {...props}
      >
        {label}
      </Button>
    );
  }
);

DefaultButton.displayName = "DefaultButton";
