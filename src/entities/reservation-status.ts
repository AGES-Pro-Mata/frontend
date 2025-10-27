import { CheckCircle2, Clock5, XCircle } from "lucide-react";
import { type ReactElement, createElement } from "react";

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
  icon: ReactElement;
};

export const RESERVATIONS_STATUS_STYLES = {
  [StatusEnum.CONFIRMADA]: {
    className: "text-contrast-green",
    icon: createElement(CheckCircle2),
  },
  [StatusEnum.CANCELADA]: {
    className: "text-default-red",
    icon: createElement(XCircle),
  },
  [StatusEnum.PAGAMENTO_PENDENTE]: {
    className: "text-warning",
    icon: createElement(Clock5),
  },
  [StatusEnum.CADASTRO_PENDENTE]: {
    className: "text-warning",
    icon: createElement(Clock5),
  },
  [StatusEnum.AGUARDANDO_APROVACAO]: {
    className: "text-warning",
    icon: createElement(Clock5),
  },
  [StatusEnum.DESCONHECIDO]: {
    className: "text-on-banner-text",
    icon: createElement(XCircle),
  },
} satisfies Record<ReservationStatus, ReservationStyle>;

export function getReservationStatusStyle(status: ReservationStatus) {
  return RESERVATIONS_STATUS_STYLES[status];
}
