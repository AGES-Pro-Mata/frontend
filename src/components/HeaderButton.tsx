import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Typography } from "./ui/typography";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
  icon?: React.ElementType;
  label: string;
  to?: string;
}

export const HeaderButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    { className, secondary, icon: Icon, label, to, children, ...props },
    ref
  ) => {
    const buttonContent = (
      <>
        {Icon && <Icon className="size-6" />}
        {<Typography className="mr-2 text-black">{label}</Typography>}
        {children}
      </>
    );

    const buttonClasses = cn(
      "rounded-full px-6 py-2 font-semibold",
      "border-0 shadow-none outline-none",
      secondary
        ? "border  border-[var(--button-border-secondary)] bg-transparent text-[var(--button-text-secondary)] hover:bg-[var(--button-bg-secondary-hover)]"
        : "bg-transparent text-[var(--button-text-primary)] hover:bg-[var(--color-selected-banner)]",
      className
    );

    if (to) {
      return (
        <Button asChild className={buttonClasses} {...props}>
          <Link to={to}>{buttonContent}</Link>
        </Button>
      );
    }

    return (
      <Button ref={ref} className={buttonClasses} {...props}>
        {buttonContent}
      </Button>
    );
  }
);

HeaderButton.displayName = "HeaderButton";
