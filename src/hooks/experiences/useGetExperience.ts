import { getExperienceById } from "@/api/experience";
import { useQuery } from "@tanstack/react-query";

export function useGetExperience(experienceId: string) {
  return useQuery({
    queryKey: ["experience", experienceId],
    queryFn: () => getExperienceById(experienceId),
    enabled: !!experienceId,
  });
}
