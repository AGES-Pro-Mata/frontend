import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { userQueryOptions, type CurrentUser } from "@/api/user";
import type { RegisterUserPayload } from "@/api/user";
import { StatusEnum } from "@/entities/reservation-status";

function mapCurrentUserToProfile(
  user: CurrentUser
): Partial<RegisterUserPayload & { function?: string }> {
  const rawNumber = user.address?.number;
  const parsedNumber =
    rawNumber && !isNaN(Number(rawNumber)) ? Number(rawNumber) : undefined;
  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    document: user.document,
    gender: user.gender,
    rg: user.rg,
    zipCode: user.address?.zip,
    addressLine: user.address?.street,
    city: user.address?.city,
    number: parsedNumber,
    institution: user.institution,
    country: user.address?.country,
    isForeign: user.isForeign ?? undefined,
    function: (user as any).function || (user as any).role || undefined,
  };
}

function resolveDocumentStatus(user?: CurrentUser) {
  if (!user) return StatusEnum.CADASTRO_PENDENTE;
  return user.verified ? StatusEnum.CONFIRMADA : StatusEnum.CADASTRO_PENDENTE;
}

export function useCurrentUserProfile() {
  const query = useQuery({ ...userQueryOptions, staleTime: 60_000 });
  const mapped = useMemo(
    () => (query.data ? mapCurrentUserToProfile(query.data) : undefined),
    [query.data]
  );
  const verified = query.data?.verified ?? false;
  const documentStatus = resolveDocumentStatus(query.data ?? undefined);
  return {
    ...query,
    mapped,
    documentStatus,
    verified,
  };
}

export type UseCurrentUserProfileReturn = ReturnType<
  typeof useCurrentUserProfile
>;
