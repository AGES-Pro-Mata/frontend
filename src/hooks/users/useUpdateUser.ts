import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateUserPayload, updateCurrentUserRequest, userQueryOptions } from "@/api/user";

export function useUpdateUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateCurrentUserRequest(payload),
    onSuccess: async () => {
      // Refetch user data to reflect updates
      await qc.invalidateQueries({ queryKey: userQueryOptions.queryKey });
    },
  });
}

export type UseUpdateUserReturn = ReturnType<typeof useUpdateUser>;
