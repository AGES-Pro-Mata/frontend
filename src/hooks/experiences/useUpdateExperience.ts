/* eslint-disable @typescript-eslint/no-floating-promises */
import { updateExperience } from "@/api/experience";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateExperience(experienceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof updateExperience>[1]) =>
      updateExperience(experienceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience", experienceId] });
      queryClient.invalidateQueries({ queryKey: ["admin-experience"] });
    },
  });
}
