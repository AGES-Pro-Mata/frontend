import { useQuery } from "@tanstack/react-query";

import { api } from "@/core/api";
import type { RawExperienceAdjustment } from "@/types/experience-adjustments";
import { useCurrentUserProfile } from "../users";

type ExperienceAdjustmentsResponse =
	| RawExperienceAdjustment[]
	| { data?: RawExperienceAdjustment[] };

type RawExperienceAdjustmentWithUser = RawExperienceAdjustment & {
	userId?: string | number | null;
	user?: { id?: string | number | null } | null;
};

const EXPERIENCE_ADJUSTMENTS_QUERY_KEY = "experienceAdjustments";

type UseExperienceAdjustmentsOptions = {
	enabled?: boolean;
};

export function useExperienceAdjustments(options?: UseExperienceAdjustmentsOptions) {
	const { data: currentUser } = useCurrentUserProfile();
	const userId = currentUser?.id;
	const isEnabled = Boolean(userId) && (options?.enabled ?? true);

	return useQuery({
		queryKey: [EXPERIENCE_ADJUSTMENTS_QUERY_KEY, userId],
		enabled: isEnabled,
		queryFn: async (): Promise<RawExperienceAdjustment[]> => {
			if (!userId) {
				return [];
			}

			const response = await api.get<ExperienceAdjustmentsResponse>(
				"/experience-adjustments"
			);
			const rawData = response.data;

			const allAdjustments = Array.isArray(rawData)
				? rawData
				: Array.isArray(rawData?.data)
				? rawData.data
				: [];

			const normalizedUserId = String(userId);
			const adjustmentsWithUser = allAdjustments as RawExperienceAdjustmentWithUser[];

			return adjustmentsWithUser.filter((experience) => {
				const directId = experience.userId;
				const nestedId = experience.user?.id;
				const directMatches = directId != null && String(directId) === normalizedUserId;
				const nestedMatches = nestedId != null && String(nestedId) === normalizedUserId;

				return directMatches || nestedMatches;
			});
		},
	});
}
