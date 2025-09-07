type CanvasCardProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function CanvasCard({ children, className }: CanvasCardProps) {
  return (
    <div
      className={`rounded-xl bg-card text-card-foreground shadow-md ${className || ""}`}
    >
      {children}
    </div>
  );
}