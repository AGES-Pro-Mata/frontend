
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
			const all = res.data.data || res.data || [];
			if (!currentUser?.id) return [];
			return all.filter((exp: any) => exp.userId === currentUser.id || exp.user?.id === currentUser.id);
		},
	});
}
