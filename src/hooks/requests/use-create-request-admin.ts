import { api } from "@/core/api";

import type { TCreateRequestsRequest } from "@/entities/create-requests-request";

import { useMutation } from "@tanstack/react-query";

export const CREATE_ADMIN_REQUESTS_MUTATION_KEY = "create-admin-requests";

export const useCreateAdminRequest = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationKey: [CREATE_ADMIN_REQUESTS_MUTATION_KEY],
    mutationFn: async (request: TCreateRequestsRequest) => {
      return await api.post<TCreateRequestsRequest>("/requests", request);
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
