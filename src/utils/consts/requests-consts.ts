import { ProfessorRequestsType, RequestsType } from "@/utils/enums/requests-enum";
import { Check, DollarSign, FileEdit, type LucideIcon, Users, X, XCircle } from "lucide-react";
export const REQUESTS_LABEL = {
  [RequestsType.APPROVED]: "requests.status.APPROVED",
  [RequestsType.CANCELED]: "requests.status.CANCELED",
  [RequestsType.CANCELED_REQUESTED]: "requests.status.CANCELED_REQUESTED",
  [RequestsType.CREATED]: "requests.status.CREATED",
  [RequestsType.EDITED]: "requests.status.EDITED",
  [RequestsType.PEOPLE_REQUESTED]: "requests.status.PEOPLE_REQUESTED",
  [RequestsType.PEOPLE_SENT]: "requests.status.PEOPLE_SENT",
  [RequestsType.PAYMENT_REQUESTED]: "requests.status.PAYMENT_REQUESTED",
  [RequestsType.PAYMENT_SENT]: "requests.status.PAYMENT_SENT",
  [RequestsType.PAYMENT_REJECTED]: "requests.status.PAYMENT_REJECTED",
  [RequestsType.PAYMENT_APPROVED]: "requests.status.PAYMENT_APPROVED",
  [RequestsType.REJECTED]: "requests.status.REJECTED",
  [RequestsType.CANCEL_REJECTED]: "requests.status.CANCEL_REJECTED",
} as Record<string | number, string>;

export const REQUESTS_ACTIONS_BUTTONS_ORDER = {
  [RequestsType.APPROVED]: [
    RequestsType.CANCELED,
    RequestsType.PAYMENT_REQUESTED,
    RequestsType.PEOPLE_REQUESTED,
  ],
  [RequestsType.CANCELED]: [],
  [RequestsType.CANCELED_REQUESTED]: [RequestsType.CANCELED, RequestsType.CANCEL_REJECTED],
  [RequestsType.CANCEL_REJECTED]: [
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

export const REQUESTS_ACTIONS_LABEL = {
  [RequestsType.APPROVED]: "requests.actions.APPROVED",
  [RequestsType.CANCELED]: "requests.actions.CANCELED",
  [RequestsType.CANCEL_REJECTED]: "requests.actions.CANCEL_REJECTED",
  [RequestsType.PAYMENT_REQUESTED]: "requests.actions.PAYMENT_REQUESTED",
  [RequestsType.PEOPLE_REQUESTED]: "requests.actions.PEOPLE_REQUESTED",
  [RequestsType.PAYMENT_APPROVED]: "requests.actions.PAYMENT_APPROVED",
  [RequestsType.PAYMENT_REJECTED]: "requests.actions.PAYMENT_REJECTED",
} as Record<string | number, string>;

export const REQUESTS_ICONS = {
  [RequestsType.APPROVED]: Check,
  [RequestsType.CANCELED]: X,
  [RequestsType.CANCELED_REQUESTED]: XCircle,
  [RequestsType.CANCEL_REJECTED]: XCircle,
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
  [ProfessorRequestsType.DOCUMENT_APPROVED]: "requests.professorStatus.DOCUMENT_APPROVED",
  [ProfessorRequestsType.DOCUMENT_REJECTED]: "requests.professorStatus.DOCUMENT_REJECTED",
  [ProfessorRequestsType.DOCUMENT_REQUESTED]: "requests.professorStatus.DOCUMENT_REQUESTED",
} as Record<string | number, string>;
