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
      void queryClient.invalidateQueries({ queryKey: ["experiences"] });
      void queryClient.invalidateQueries({ queryKey: ["experience"] });
      void queryClient.invalidateQueries({ queryKey: [ADMIN_EXPERIENCES_QUERY_KEY] });
      void queryClient.invalidateQueries({ queryKey: ["experienceAdjustments"] });
    },
  });
}
