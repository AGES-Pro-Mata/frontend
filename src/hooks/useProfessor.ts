import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/api/user";

export function useProfessorById(id: string) {
  return useQuery({
    queryKey: ["professor", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
}
