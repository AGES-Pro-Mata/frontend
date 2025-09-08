import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography/typography";

interface GreyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const GreyButton = React.forwardRef<HTMLButtonElement, GreyButtonProps>(
  ({ className, label, children, ...props }, ref) => {
    const buttonClasses = cn(
      "rounded-[8px] w-fit px-3 py-5 font-semibold",
      "bg-[#6C6C6C] text-white hover:bg-[#474747] hover:cursor-pointer active:bg-gray-800",
      "border-0 shadow-none outline-none",
      className
    );

    return (
      <Button ref={ref} className={buttonClasses} {...props}>
        <Typography className="text-white">{label}</Typography>
        {children}
      </Button>
    );
  }
);

GreyButton.displayName = "GreyButton";
