import { ProfessorRequestsType, RequestsType } from "@/utils/enums/requests-enum";
import { Check, DollarSign, FileEdit, type LucideIcon, Users, X, XCircle } from "lucide-react";

//TODO: traduzir com i18n
export const REQUESTS_LABEL = {
  [RequestsType.APPROVED]: "Aprovada",
  [RequestsType.CANCELED]: "Cancelada",
  [RequestsType.CANCELED_REQUESTED]: "Cancelamento Solicitado",
  [RequestsType.CREATED]: "Nova",
  [RequestsType.EDITED]: "Edição pendente",
  [RequestsType.PEOPLE_REQUESTED]: "Pessoas Solicitadas",
  [RequestsType.PEOPLE_SENT]: "Pessoas Enviadas",
  [RequestsType.PAYMENT_REQUESTED]: "Pagamento Solicitado",
  [RequestsType.PAYMENT_SENT]: "Pagamento Enviado",
  [RequestsType.PAYMENT_REJECTED]: "Pagamento Rejeitado",
  [RequestsType.REJECTED]: "Rejeitada",
} as Record<string | number, string>;

export const REQUESTS_ACTIONS_BUTTONS_ORDER = {
  [RequestsType.APPROVED]: [
    RequestsType.CANCELED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.CANCELED]: [],
  [RequestsType.CANCELED_REQUESTED]: [
    RequestsType.CANCELED,
    RequestsType.APPROVED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.CREATED]: [
    RequestsType.CANCELED,
    RequestsType.APPROVED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.EDITED]: [
    RequestsType.CANCELED,
    RequestsType.APPROVED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.PEOPLE_REQUESTED]: [RequestsType.CANCELED, RequestsType.APPROVED],
  [RequestsType.PEOPLE_SENT]: [
    RequestsType.CANCELED,
    RequestsType.APPROVED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.PAYMENT_REQUESTED]: [RequestsType.CANCELED, RequestsType.APPROVED],
  [RequestsType.PAYMENT_SENT]: [RequestsType.PAYMENT_APPROVED, RequestsType.PAYMENT_REJECTED],
  [RequestsType.PAYMENT_REJECTED]: [RequestsType.CANCELED, RequestsType.PAYMENT_REQUESTED],
  [RequestsType.PAYMENT_APPROVED]: [
    RequestsType.CANCELED,
    RequestsType.APPROVED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.REJECTED]: [],
};
//TODO: traduzir com i18n
export const REQUESTS_ACTIONS_LABEL = {
  [RequestsType.APPROVED]: "APROVAR",
  [RequestsType.CANCELED]: "CANCELAR",
  [RequestsType.PAYMENT_REQUESTED]: "SOLICITAR PAGAMENTO",
  [RequestsType.PEOPLE_REQUESTED]: "SOLICITAR PESSOAS",
  [RequestsType.PAYMENT_APPROVED]: "CONFIRMAR PAGAMENTO",
  [RequestsType.PAYMENT_REJECTED]: "REJEITAR PAGAMENTO",
} as Record<string | number, string>;

export const REQUESTS_ICONS = {
  [RequestsType.APPROVED]: Check,
  [RequestsType.CANCELED]: X,
  [RequestsType.CANCELED_REQUESTED]: XCircle,
  [RequestsType.CREATED]: FileEdit,
  [RequestsType.EDITED]: FileEdit,
  [RequestsType.PEOPLE_REQUESTED]: Users,
  [RequestsType.PEOPLE_SENT]: Users,
  [RequestsType.PAYMENT_REQUESTED]: DollarSign,
  [RequestsType.PAYMENT_SENT]: DollarSign,
  [RequestsType.PAYMENT_REJECTED]: XCircle,
  [RequestsType.REJECTED]: X,
} as Record<string | number, LucideIcon>;

export const PROFESSOR_REQUESTS_LABEL = {
  [ProfessorRequestsType.DOCUMENT_APPROVED]: "Documento Aprovado",
  [ProfessorRequestsType.DOCUMENT_REJECTED]: "Documento Rejeitado",
  [ProfessorRequestsType.DOCUMENT_REQUESTED]: "Documento Enviado",
} as Record<string | number, string>;
