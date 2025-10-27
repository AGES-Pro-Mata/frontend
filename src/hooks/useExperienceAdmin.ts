import { useQuery } from "@tanstack/react-query";

export function useExperienceAdmin(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["experiences", page, pageSize],
    queryFn: async () => {
      const res = await fetch(`/api/experiences?page=${page}&pageSize=${pageSize}`);

      if (!res.ok) throw new Error("Erro ao buscar experiências");

      return res.json();
    },
  });
}