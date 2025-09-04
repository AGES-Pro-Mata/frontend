import { queryOptions, useQuery } from "@tanstack/react-query";

export type CurrentUser = { id: string; name: string; roles: string[] };

export const userQueryOptions = queryOptions({
  queryKey: ["me"],
  queryFn: (): CurrentUser => {
    return {
      id: "1",
      name: "John Doe",
      roles: ["ADMIN"],
    };
  },
  staleTime: 5 * 60 * 1000, // 5 minutos
});

export function useIsAdmin() {
  const { data } = useQuery(userQueryOptions);
  return !!data?.roles?.includes("ADMIN");
}
