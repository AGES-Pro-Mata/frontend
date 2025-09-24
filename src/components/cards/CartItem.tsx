import React from "react";
import { BsSpeedometer2 } from "react-icons/bs";

type Category = "TRAIL" | "ROOM" | "EVENT";
type TrailDifficulty = "EASY" | "MEDIUM" | "HARD";

export type ExperienceDTO = {
  id: string;
  name: string;
  category: Category;
  capacity: number;
  startDate?: string | null;
  endDate?: string | null;
  price?: number | null;
  weekDays?: string[] | null;
  durationMinutes?: number | null;
  trailDifficulty?: TrailDifficulty | null;
  trailLength?: number | null;
  image?: { url: string } | null;
  imageId?: string | null;
};

export interface CartItemProps {
  experience: ExperienceDTO;
  onClick?: () => void;
  className?: string;
}

const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const fmtBRL = (n?: number | null) => BRL.format(n || 0);
const minutesToHours = (m?: number | null) => (m ? +(m / 60).toFixed(1) : 0);
const difficultyLabel = (d?: TrailDifficulty | null) =>
  d === "EASY" ? "Fácil" : d === "MEDIUM" ? "Moderada" : d === "HARD" ? "Difícil" : undefined;
const dateRangeLabel = (start?: string | null, end?: string | null) => {
  if (!start && !end) return undefined;
  const f = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  if (start && end) return `${f.format(new Date(start))} – ${f.format(new Date(end))}`;
  const d = start ?? end!;
  return f.format(new Date(d));
};

const Line: React.FC<{ iconSrc?: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  iconSrc,
  icon,
  children,
}) => (
  <div className="inline-flex items-center gap-2 text-[13px] font-bold leading-none text-neutral-900">
    {icon ?? (iconSrc ? <img src={iconSrc} alt="" className="w-5 h-5" /> : null)}
    {children}
  </div>
);

const PriceBlock: React.FC<{ price: string }> = ({ price }) => (
  <div className="inline-flex items-center justify-center rounded-full bg-[#E9E1D9] px-3 py-1 shadow-sm ring-1 ring-stone-100/60">
    <span className="font-extrabold text-[13px] leading-none text-[#2F3A27]">{price}</span>
  </div>
);

const CartItem: React.FC<CartItemProps> = ({ experience: e, onClick, className }) => {
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
      <Line icon={<BsSpeedometer2 className="w-5 h-5 text-black" />}>{difficultyText}</Line>
    ) : null;

  const eventDateLabel = e.category === "EVENT" ? dateRangeLabel(e.startDate, e.endDate) : undefined;
  const eventDateLine =
    e.category === "EVENT" && eventDateLabel ? <Line iconSrc="/weekDays.svg">{eventDateLabel}</Line> : null;

  return (
    <article
      className={[
        "grid grid-cols-[239px_1fr_auto] items-start gap-4",
        "w-[626px] h-[168px]",
        "rounded-[10px] bg-[#D6CCC2] p-4",
        "shadow-sm ring-1 ring-stone-300/60",
        "font-[Montserrat]",
        "focus:outline-none",
        className ?? "",
      ].join(" ")}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt=""
        className="w-[239px] h-[134px] rounded-md object-cover border"
        loading="lazy"
      />

      <div className="flex flex-col h-full mt-0 mb-0">
        <h3 className="font-bold text-[20px] leading-none text-neutral-900 mt-[0px] mb-3">{title}</h3>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-0 mb-2">
          <div className="flex flex-col gap-2">
            {capacityLine}
            {difficultyLine}
            {eventDateLine}
          </div>

          <div className="flex flex-col gap-2">
            {lengthLine}
            {durationLine}
          </div>
        </div>

        <div className="flex justify-start">
          <PriceBlock price={price} />
        </div>
      </div>

      <div className="self-middle pt-1">
        <img src="/trash.svg" alt="Remover" className="w-6 h-6" />
      </div>
    </article>
  );
};

export default CartItem;
