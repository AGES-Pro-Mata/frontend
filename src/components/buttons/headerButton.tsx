import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Typography } from "@/components/typography/typography";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
  icon?: React.ReactNode;
  label: string;
  to?: string;
  selected?: boolean;
}

export const HeaderButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(
  (
    { className, secondary, icon, label, to, selected, children, ...props },
    ref
  ) => {
    const buttonContent = secondary ? (
      <>
        <Typography className="mr-0.5 text-main-dark-green">{label}</Typography>
        {icon && (
          <Typography className="text-main-dark-green">{icon}</Typography>
        )}
        {children}
      </>
    ) : (
      <>
        {icon && (
          <Typography className="mr-2 text-on-banner-text">{icon}</Typography>
        )}
        <Typography className="mr-2 text-on-banner-text">{label}</Typography>
        {children}
      </>
    );

    const buttonClasses = cn(
      "rounded-full px-6 py-2 font-semibold",
      "border-0 shadow-none outline-none",
      secondary
        ? "border border-main-dark-green bg-transparent text-main-dark-green hover:bg-main-dark-green/10"
        : selected
          ? "bg-selected-banner text-main-dark-green"
          : "bg-transparent text-on-banner-text hover:bg-selected-banner",
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
