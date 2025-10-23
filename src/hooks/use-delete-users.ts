import { deleteUser } from "@/api/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ADMIN_USERS_QUERY_KEY } from "./use-fetch-admin-users";

export const DELETE_USER_MUTATION_KEY = ["deleteUser"];

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationKey: DELETE_USER_MUTATION_KEY,
    mutationFn: async (id: string) => await deleteUser(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [ADMIN_USERS_QUERY_KEY] });
    },
  });

  return { handleDeleteUser: mutateAsync };
};
