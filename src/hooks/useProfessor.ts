import { useQuery } from "@tanstack/react-query";
import { getProfessorById } from "@/api/professor";

export function useProfessorById(id: string) {
  return useQuery({
    queryKey: ["professor", id],
    queryFn: () => getProfessorById(id),
    enabled: !!id,
  });
}
