
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useCurrentUserProfile } from "./useCurrentUser";

export function useExperienceAdjustments() {
	const { data: currentUser } = useCurrentUserProfile();

	return useQuery({
		queryKey: ["experienceAdjustments", currentUser?.id],
		enabled: !!currentUser?.id,
		queryFn: async () => {
			const res = await axios.get("/api/experience-adjustments");
			const payload: unknown = res?.data;

			type ExperienceAdjustment = {
				userId?: string | number;
				user?: { id?: string | number } | null;
			};

			function hasDataArray(x: unknown): x is { data: ExperienceAdjustment[] } {
				return typeof x === "object" && x !== null && Array.isArray((x as { data?: unknown }).data);
			}

			const all: ExperienceAdjustment[] = hasDataArray(payload)
				? payload.data
				: Array.isArray(payload)
				? (payload as ExperienceAdjustment[])
				: [];

			return all.filter((exp) =>
				exp.userId === currentUser?.id || exp.user?.id === currentUser?.id,
			);
		},
	});
}
