import { Button } from "@/components/ui/button";

interface DefaultButtonProps {
  label: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export function DefaultButton({
  label,
  variant = "primary",
  onClick,
}: DefaultButtonProps) {
  const base = "shadow-xs transition-none";

  const styles = {
    primary:
      "bg-[#4C9613] text-white hover:!bg-[#4C9613] hover:!text-white",
    secondary:
      "bg-[#D6CCC2] text-zinc-900 border border-[#D6CCC2] " +
      "hover:!bg-[#D6CCC2] hover:!text-zinc-900 hover:!border-[#D6CCC2]",
  } as const;

  return (
    <Button
      variant="ghost"
      className={`${base} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
