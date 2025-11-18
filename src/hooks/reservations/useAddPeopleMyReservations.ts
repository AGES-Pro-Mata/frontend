import { type RegisterMember, addPeopleMyReservations } from '@/api/reservation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MY_RESERVATION_KEY } from './useMyReservations';

export const ADD_PEOPLE_RESERVATION_MUTATION_KEY = ['CANCEL_RESERVATION_MUTATION_KEY'];

export const useAddPeopleMyReservations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ADD_PEOPLE_RESERVATION_MUTATION_KEY,
    mutationFn: async (input: { id: string; people: RegisterMember[] }) =>
      await addPeopleMyReservations(input.id, input.people),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [MY_RESERVATION_KEY] });
    },
  });
};
