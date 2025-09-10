import { useQuery } from "@tanstack/react-query";
import { userQueryOptions, type CurrentUser } from "@/api/user";
import type { RegisterUserPayload } from "@/api/user";
import { StatusEnum } from "@/components/cards/cardStatus";

function mapCurrentUserToProfile(user: CurrentUser): Partial<RegisterUserPayload> {
  const rawNumber = user.address?.number;
  const parsedNumber = rawNumber && !isNaN(Number(rawNumber)) ? Number(rawNumber) : undefined;
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    cpf: user.cpf,
    gender: user.gender,
    rg: user.rg,
    zipCode: user.address?.zip,
    addressLine: user.address?.street,
    city: user.address?.city,
    number: parsedNumber,
    institution: user.institution,
  };
}

function resolveDocumentStatus(user?: CurrentUser) {
  if (!user) return StatusEnum.CADASTRO_PENDENTE;
  return user.verified ? StatusEnum.CONFIRMADA : StatusEnum.CADASTRO_PENDENTE;
}

export function useCurrentUserProfile() {
  const query = useQuery({ ...userQueryOptions, staleTime: 60_000 });
  const mapped = query.data ? mapCurrentUserToProfile(query.data) : undefined;
  const documentStatus = resolveDocumentStatus(query.data ?? undefined);
  return {
    ...query,
    mapped,
    documentStatus,
  };
}

export type UseCurrentUserProfileReturn = ReturnType<typeof useCurrentUserProfile>;