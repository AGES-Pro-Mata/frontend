/* eslint-disable @typescript-eslint/no-floating-promises */
import { toggleExperienceStatus } from "@/api/experience";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_EXPERIENCES_QUERY_KEY } from "./useFetchAdminExperiences";

export function useToggleExperienceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ experienceId, active }: { experienceId: string; active: boolean }) => 
      toggleExperienceStatus(experienceId, active),
    onSuccess: () => {
      // Invalidate and refetch all experience-related queries
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["experience"] });
      queryClient.invalidateQueries({ queryKey: [ADMIN_EXPERIENCES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ["experienceAdjustments"] });
    },
  });
}
