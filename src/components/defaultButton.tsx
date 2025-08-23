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
  const base = "shadow-xs transition-none"; // sem animação

  const styles = {
    primary:
      // cor fixa no normal e no hover
      "bg-[#4C9613] text-white hover:!bg-[#4C9613] hover:!text-white",
    secondary:
      "bg-[#D6CCC2] text-zinc-900 border border-[#D6CCC2] " +
      "hover:!bg-[#D6CCC2] hover:!text-zinc-900 hover:!border-[#D6CCC2]",
  } as const;

  return (
    <Button
      // usamos uma variante do shadcn, mas “anulamos” o hover com classes !
      variant="ghost"
      className={`${base} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
