import React from "react";

type CanvasCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function CanvasCard({ children, className }: CanvasCardProps) {
  return (
    <div
      className={`rounded-xl bg-card text-card-foreground shadow-md border p-6 transition-all duration-300 hover:shadow-lg ${className || ""}`}
    >
      {children}
    </div>
  );
}
