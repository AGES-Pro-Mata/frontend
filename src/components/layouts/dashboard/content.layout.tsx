import { cn } from "@/lib/utils";

type ContentLayoutProps = {
  className?: string;
  children: React.ReactNode;
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
