import { RequestsType } from "@/utils/enums/requests-enum";

//TODO: traduzir com i18n
export const REQUESTS_LABEL = {
  [RequestsType.APPROVED]: "Aprovado",
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
  [RequestsType.PAYMENT_SENT]: [
    RequestsType.CANCELED,
    RequestsType.APPROVED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.PAYMENT_REJECTED]: [
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
} as Record<string | number, string>;
