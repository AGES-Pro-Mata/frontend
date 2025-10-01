import { deleteUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export const DELETE_USER_MUTATION_KEY = ["deleteUser"];

export const useDeleteUser = () => {
  const { mutateAsync } = useMutation({
    mutationKey: DELETE_USER_MUTATION_KEY,
    mutationFn: async (id: string) => await deleteUser(id),
  });
  return { handleDeleteUser: mutateAsync };
};
