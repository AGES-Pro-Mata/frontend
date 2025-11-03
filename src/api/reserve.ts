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
	document: string;
	gender: ReserveParticipantGender;
};

export type ReservationAdjustmentPayload = Omit<ExperienceTuningData, "experienceId"> & {
	experienceId: string;
};

export type ReservationPayload = {
	experienceId: string;
	startDate: string;
	endDate: string;
	membersCount: number;
	adjustments: ReservationAdjustmentPayload[];
};

export type CreateGroupReservationPayload = {
	allowPostConfirmation: boolean;
	notes: string;
	members: GroupReservationParticipantPayload[];
	reservations: ReservationPayload[];
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
