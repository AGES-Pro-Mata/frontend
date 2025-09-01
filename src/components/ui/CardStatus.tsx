import { Clock5, XCircle } from "lucide-react";

import { CheckCircle2 } from "lucide-react";
import type { JSX } from "react";
import React from "react";

export const StatusEnum = {
  CONFIRMADA: "confirmada",
  PAGAMENTO_PENDENTE: "pagamento_pendente",
  CADASTRO_PENDENTE: "cadastro_pendente",
  AGUARDANDO_APROVACAO: "aguardando_aprovacao",
  CANCELADA: "cancelada",
  DESCONHECIDO: "desconhecido",
} as const;

export type ReservationStatus = (typeof StatusEnum)[keyof typeof StatusEnum];

type ReservationStyle = {
  className: string;
  label: string;
  icon: JSX.Element;
};

export const RESERVATIONS_STATUS_STYLES = {
  [StatusEnum.CONFIRMADA]: {
    className: "text-contrast-green",
    icon: <CheckCircle2 />,
    label: "Confirmada",
  },
  [StatusEnum.CANCELADA]: {
    className: "text-default-red",
    icon: <XCircle />,
    label: "Cancelada",
  },
  [StatusEnum.PAGAMENTO_PENDENTE]: {
    className: "text-warning",
    icon: <Clock5 />,
    label: "Pagamento pendente",
  },
  [StatusEnum.CADASTRO_PENDENTE]: {
    className: "text-warning",
    icon: <Clock5 />,
    label: "Cadastro pendente",
  },
  [StatusEnum.AGUARDANDO_APROVACAO]: {
    className: "text-warning",
    icon: <Clock5 />,
    label: "Aguardando aprovação",
  },
  [StatusEnum.DESCONHECIDO]: {
    className: "text-on-banner-text",
    icon: <XCircle />,
    label: "Desconhecido",
  },
} satisfies Record<ReservationStatus, ReservationStyle>;

type CardStatusProps = {
  status: ReservationStatus;
};

const cardStatusIconClass = "h-5 w-5";

function CardStatus({ status }: CardStatusProps): JSX.Element {
  const { className, label, icon } = RESERVATIONS_STATUS_STYLES[status];

  return (
    <span
      className={`relative inline-flex items-center gap-[8px] px-[10px] py-[2px] rounded-full border-[0.5px] border-dark-gray text-sm w-fit font-bold ${className}`}
    >
      {React.cloneElement(icon, { className: cardStatusIconClass })}
      <span className="relative z-10">{label}</span>
    </span>
  );
}

export default CardStatus;
