import React from "react";
import { BsSpeedometer2 } from "react-icons/bs";
import type { ExperienceDTO } from "@/types/experiences";
import { Trash2 } from "lucide-react"; // Usando um ícone para consistência

export interface CartItemProps {
  experience: ExperienceDTO;
  onRemove?: () => void; // Prop para a função de remover
  onClick?: () => void;
  className?: string;
}

const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const fmtBRL = (n?: number | null) => BRL.format(n || 0);
const minutesToHours = (m?: number | null) => (m ? +(m / 60).toFixed(1) : 0);
const difficultyLabel = (d?: string | null) =>
  d === "EASY" ? "Fácil" : d === "MEDIUM" ? "Moderada" : d === "HARD" ? "Difícil" : undefined;
const dateRangeLabel = (start?: string | null, end?: string | null) => {
  if (!start && !end) return undefined;
  const f = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (start && end) return `${f.format(new Date(start))} – ${f.format(new Date(end))}`;
  const d = start ?? end!;
  return f.format(new Date(d));
};

const Line: React.FC<{ iconSrc?: string; icon?: React.ReactNode; children: React.ReactNode; }> = ({ iconSrc, icon, children }) => (
  <div className="inline-flex items-center gap-2 text-[13px] font-bold leading-none text-foreground">
    {icon ?? (iconSrc ? <img src={iconSrc} alt="" className="w-5 h-5" /> : null)}
    {children}
  </div>
);

const PriceBlock: React.FC<{ price: string }> = ({ price }) => (
  <div className="inline-flex items-center justify-center rounded-full bg-[#F6EDE4] px-3 py-1 shadow-sm">
    <span className="font-extrabold text-[13px] leading-none text-[#2F3A27]">
      {price}
    </span>
  </div>
);

const CartItem: React.FC<CartItemProps> = ({ experience: e, onRemove, onClick, className }) => {
  const imageUrl = e.image?.url ?? "/placeholder.png";
  const title = e.name;
  const price = fmtBRL(e.price);
  const capacityLine = <Line iconSrc="/capacity.svg">{e.capacity} pessoas</Line>;
  const lengthLine = e.category === "TRAIL" && e.trailLength != null ? (<Line iconSrc="/trailLength.svg">{e.trailLength} km</Line>) : null;
  const durationLine = e.category === "TRAIL" ? (<Line iconSrc="/trailDuration.svg">{minutesToHours(e.durationMinutes)} h</Line>) : null;
  const difficultyText = difficultyLabel(e.trailDifficulty);
  const difficultyLine = e.category === "TRAIL" && difficultyText ? (<Line icon={<BsSpeedometer2 className="w-5 h-5 text-foreground" />}>{difficultyText}</Line>) : null;
  const eventDateLabel = e.category === "EVENT" ? dateRangeLabel(e.startDate, e.endDate) : undefined;
  const eventDateLine = e.category === "EVENT" && eventDateLabel ? <Line iconSrc="/weekDays.svg">{eventDateLabel}</Line> : null;

  return (
    <article
      className={[
        "grid grid-cols-[1fr_2fr_auto] items-start gap-4",
        "w-full",
        "rounded-lg bg-card p-3",
        "shadow-sm border border-border",
        "font-[Montserrat]",
        className ?? "",
      ].join(" ")}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt=""
        className="aspect-video w-full rounded-md object-cover"
        loading="lazy"
      />

      <div className="flex flex-col h-full">
        <h3 className="font-bold text-base leading-tight text-foreground mb-2">{title}</h3>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-3 text-xs">
          {capacityLine}
          {difficultyLine}
          {eventDateLine}
          {lengthLine}
          {durationLine}
        </div>

        <div className="flex justify-start mt-auto">
          <PriceBlock price={price} />
        </div>
      </div>

      <button
        onClick={onRemove}
        aria-label="Remover item"
        className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-full"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </article>
  );
};

export default CartItem;