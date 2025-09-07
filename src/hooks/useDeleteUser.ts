import { deleteUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export function useDeleteUser() {
  return useMutation({
    mutationFn: deleteUser
  })
}
