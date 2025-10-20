import React, { Fragment, type ReactElement } from "react";
import { BsSpeedometer2 } from "react-icons/bs";
import { Trash2 } from "lucide-react";
import type { ExperienceDTO } from "@/types/experience";
import { cn } from "@/lib/utils";

export interface CartItemProps {
  experience: ExperienceDTO;
  onSelect?: (experience: ExperienceDTO) => void;
  onRemove?: (experienceId: ExperienceDTO["id"]) => void;
  className?: string;
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmtBRL = (value?: number | null) => BRL.format(value ?? 0);
const minutesToHours = (m?: number | null) => (m ? +(m / 60).toFixed(1) : 0);
const difficultyLabel = (d?: string | null) =>
  d === "EASY" ? "Fácil" : d === "MEDIUM" ? "Moderada" : d === "HARD" ? "Difícil" : undefined;
const dateRangeLabel = (start?: string | null, end?: string | null) => {
  if (!start && !end) return undefined;
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (start && end) return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
  const date = start ?? end!;
  return formatter.format(new Date(date));
};

const Line: React.FC<{ iconSrc?: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  iconSrc,
  icon,
  children,
}) => (
  <div className="inline-flex items-center gap-2 text-[13px] font-bold leading-none text-foreground">
    {icon ?? (iconSrc ? <img src={iconSrc} alt="" className="w-5 h-5" /> : null)}
    {children}
  </div>
);

const PriceBlock: React.FC<{ price: string }> = ({ price }) => (
  <div className="inline-flex items-center justify-center rounded-full bg-[#F6EDE4] px-3 py-1 shadow-sm">
    <span className="font-extrabold text-[13px] leading-none text-[#2F3A27]">{price}</span>
  </div>
);

const CartItem: React.FC<CartItemProps> = ({ experience: e, onSelect, onRemove, className }) => {
  const imageUrl = e.image?.url ?? "/placeholder.png";
  const title = e.name;
  const price = fmtBRL(e.price);

  const capacityLine = <Line iconSrc="/capacity.svg">{e.capacity} pessoas</Line>;
  const lengthLine =
    e.category === "TRAIL" && e.trailLength != null ? (
      <Line iconSrc="/trailLength.svg">{e.trailLength} km</Line>
    ) : null;
  const durationLine =
    e.category === "TRAIL" ? (
      <Line iconSrc="/trailDuration.svg">{minutesToHours(e.durationMinutes)} h</Line>
    ) : null;
  const difficultyText = difficultyLabel(e.trailDifficulty);
  const difficultyLine =
    e.category === "TRAIL" && difficultyText ? (
      <Line icon={<BsSpeedometer2 className="w-5 h-5 text-foreground" />}>{difficultyText}</Line>
    ) : null;
  const eventDateLabel = e.category === "EVENT" ? dateRangeLabel(e.startDate, e.endDate) : undefined;
  const eventDateLine =
    e.category === "EVENT" && eventDateLabel ? <Line iconSrc="/weekDays.svg">{eventDateLabel}</Line> : null;

  const handleSelect = () => {
    if (onSelect) onSelect(e);
  };
  const handleRemove = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (onRemove) onRemove(e.id);
  };

  const leftInfo = [capacityLine, difficultyLine, eventDateLine].filter(
    (line): line is ReactElement => Boolean(line),
  );
  const rightInfo = [lengthLine, durationLine].filter((line): line is ReactElement => Boolean(line));

  return (
    <article
      className={cn(
        "flex w-full gap-3 rounded-[10px] bg-card p-4 shadow-sm font-[Montserrat] focus:outline-none",
        className,
      )}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : -1}
      onClick={handleSelect}
    >
      <img
        src={imageUrl}
        alt=""
        className="h-[110px] w-[148px] flex-shrink-0 rounded-md border object-cover"
        loading="lazy"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="flex-1 text-[16px] font-semibold leading-tight text-foreground">
            {title}
          </h3>
          <button
            type="button"
            onClick={handleRemove}
            className="cursor-pointer rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
          >
            <Trash2 className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          className={cn(
            "grid gap-x-6 gap-y-2 text-[13px] text-foreground",
            rightInfo.length > 0 ? "grid-cols-2" : "grid-cols-1",
          )}
        >
          <div className="flex flex-col gap-2">
            {leftInfo.map((line, index) => (
              <Fragment key={`left-${index}`}>{line}</Fragment>
            ))}
          </div>
          {rightInfo.length > 0 && (
            <div className="flex flex-col gap-2">
              {rightInfo.map((line, index) => (
                <Fragment key={`right-${index}`}>{line}</Fragment>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <PriceBlock price={price} />
        </div>
      </div>
    </article>
  );
};

export default CartItem;
