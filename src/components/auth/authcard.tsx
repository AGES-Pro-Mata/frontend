import type { ReactNode } from "react";
import CanvasCard from "@/components/cards/canvasCard";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <CanvasCard
      className={`w-full max-w-lg p-8 flex flex-col gap-8 shadow-md ${className || ""}`}
    >
      {children}
    </CanvasCard>
  );
}
