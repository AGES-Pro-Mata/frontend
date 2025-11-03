import { api } from "@/core/api";
import { safeApiCall } from "@/core/http/safe-api-caller";
import type { ExperienceTuningData } from "@/types/experience";
import type { ReserveParticipantGender } from "@/types/reserve";
import { z } from "zod";

export type GroupReservationParticipantPayload = {
	name: string;
	phone: string;
	birthDate: string;
	cpf: string;
	gender: ReserveParticipantGender;
};

export type ReservationAdjustmentPayload = Omit<ExperienceTuningData, "experienceId"> & {
	experienceId: string;
};

export type ReservationExperiencePayload = {
	experienceId: string;
	adjustment?: ReservationAdjustmentPayload | null;
};

export type CreateGroupReservationPayload = {
	allowPostConfirmation: boolean;
	notes: string;
	participants: GroupReservationParticipantPayload[];
	adjustments: ReservationAdjustmentPayload[];
	experiences: ReservationExperiencePayload[];
};

const createGroupReservationResponseSchema = z.unknown();

export type CreateGroupReservationResponse = z.infer<
	typeof createGroupReservationResponseSchema
>;

export async function createGroupReservation(
	payload: CreateGroupReservationPayload
): Promise<CreateGroupReservationResponse> {
	const response = await safeApiCall(
		api.post("/reservation/group", payload),
		createGroupReservationResponseSchema
	);

	return response;
}
