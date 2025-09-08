import { createExperience } from "@/api/experience";
import { useMutation } from "@tanstack/react-query";

export function useCreateExperience() {
  return useMutation({
    mutationFn: createExperience,
  });
}