import { deleteExperience } from "@/api/experience";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_EXPERIENCES_QUERY_KEY } from "./use-fetch-admin-experiences";

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (experienceId: string) => deleteExperience(experienceId),
    onSuccess: () => {
      // Invalidate and refetch all experience-related queries
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_EXPERIENCES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["experienceAdjustments"] });
    },
  });
}
