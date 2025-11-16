import { type UpdateUserAdminPayload, updateUserRequest } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export function useUpdateAdminUser() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserAdminPayload;
    }) => updateUserRequest(payload, id),
  });
}
