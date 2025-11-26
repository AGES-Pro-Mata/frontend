/* eslint-disable @typescript-eslint/no-floating-promises */
import { type UseMutationOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import {
  type CreateGroupReservationPayload,
  type CreateGroupReservationResponse,
  createGroupReservation,
} from "@/api/reserve";
import { MY_RESERVATION_KEY } from "./useMyReservations";

export function useCreateGroupReservation(
  options?: UseMutationOptions<
    CreateGroupReservationResponse,
    AxiosError,
    CreateGroupReservationPayload
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroupReservation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MY_RESERVATION_KEY],
      });
    },
    ...options,
  });
}
