import * as React from "react";
import { cn } from "@/lib/utils";
import { Button as ShadButton } from "@/components/ui/button";

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
}

export const CustomButton = React.forwardRef<
  HTMLButtonElement,
  CustomButtonProps
>(({ className, secondary, children, ...props }, ref) => {
  return (
    <ShadButton
      ref={ref}
      className={cn(
        "rounded-full px-6 py-2 font-semibold transition-all duration-300 shadow-sm",
        "hover:scale-105 hover:shadow-md",
        secondary
          ? "bg-[#EDE9D5] text-black hover:bg-[#ddd7c4]"
          : "bg-[#F6EEC9] text-black hover:bg-[#ebdfb8]",
        className
      )}
      {...props}
    >
      {children}
    </ShadButton>
  );
});

CustomButton.displayName = "CustomButton";
