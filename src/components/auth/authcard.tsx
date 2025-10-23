import type { ReactNode } from "react";
import CanvasCard from "@/components/card/canvasCard";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <CanvasCard
      className={`w-full max-w-lg p-5 sm:p-6 md:p-8 flex flex-col gap-6 sm:gap-8 shadow-md ${className || ""}`}
    >
      {children}
    </CanvasCard>
  );
}
