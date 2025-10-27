import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContentLayoutProps = {
  className?: string;
  children: ReactNode;
};

export const ContentLayout = ({ className, children }: ContentLayoutProps) => {
  return (
    <div
      className={cn(
        "!w-full flex-1",
        className
      )}
    >
      {children}
    </div>
  );
};
