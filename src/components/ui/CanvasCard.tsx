type CanvasCardProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function CanvasCard({ children, className }: CanvasCardProps) {
  return (
    <div
      className={`rounded-xl bg-[oklch(1_0_0)] text-card-foreground shadow-md transition-all duration-300 hover:shadow-lg ${className || ""}`}
      style={{ background: 'oklch(1 0 0)' }}
    >
      {children}
    </div>
  );
}