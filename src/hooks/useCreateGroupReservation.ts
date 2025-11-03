import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import {
  type CreateGroupReservationPayload,
  type CreateGroupReservationResponse,
  createGroupReservation,
} from "@/api/reserve";

export function useCreateGroupReservation(
  options?: UseMutationOptions<
    CreateGroupReservationResponse,
    AxiosError,
    CreateGroupReservationPayload
  >
) {
  return useMutation({
    mutationFn: createGroupReservation,
    ...options,
  });
}
