import { cancelReservation } from '@/api/reservation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MY_RESERVATION_KEY } from './useMyReservations';

export const CANCEL_RESERVATION_MUTATION_KEY = ['cancelReservation'];

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: CANCEL_RESERVATION_MUTATION_KEY,
    mutationFn: async (id: string) => await cancelReservation(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [MY_RESERVATION_KEY] });
    },
  });
};
