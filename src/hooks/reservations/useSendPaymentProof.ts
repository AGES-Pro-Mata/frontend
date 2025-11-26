/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  type UseMutationResult,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { sendPaymentProof } from "@/api/my-reservations";
import { MY_RESERVATION_KEY } from "./useMyReservations";

interface SendPaymentProofParams {
  reservationGroupId: string;
  file: File;
}

export function useSendPaymentProof(): UseMutationResult<
  void,
  Error,
  SendPaymentProofParams,
  unknown
> {
  const queryClient = useQueryClient();

  return useMutation<void, Error, SendPaymentProofParams, unknown>({
    mutationFn: async ({ reservationGroupId, file }: SendPaymentProofParams) => {
      await sendPaymentProof(reservationGroupId, file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MY_RESERVATION_KEY] });
    },
  });
}
