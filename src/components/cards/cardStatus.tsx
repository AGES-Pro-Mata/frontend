import { cn } from "@/lib/utils";
import { cloneElement, isValidElement, type JSX, type ReactNode } from "react";

export type CardStatusProps = {
  icon?: ReactNode;
  label: string;
  accentClassName?: string;
  className?: string;
};

export const CARD_STATUS_ICON_CLASS = "h-5 w-5";

const CARD_STATUS_BASE_CLASS =
  "relative inline-flex items-center gap-[8px] px-[10px] py-[2px] rounded-full border-[0.5px] shadow-sm text-sm w-fit font-bold bg-card-light";

function CardStatus({
  icon,
  label,
  accentClassName,
  className,
}: CardStatusProps): JSX.Element {
  const iconElement = isValidElement<{ className?: string }>(icon)
    ? icon
    : null;
  const renderedIcon = iconElement
    ? cloneElement(iconElement, {
        className: cn(CARD_STATUS_ICON_CLASS, iconElement.props.className),
      })
    : (icon ?? null);

  return (
    <span className={cn(CARD_STATUS_BASE_CLASS, accentClassName, className)}>
      {renderedIcon}
      <span className="relative z-10">{label}</span>
    </span>
  );
}

export default CardStatus;
