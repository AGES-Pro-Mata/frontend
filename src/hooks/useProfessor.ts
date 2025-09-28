import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/user";

export function useGetProfessorById(id: string) {
  return useQuery({
    queryKey: ["professor", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}
