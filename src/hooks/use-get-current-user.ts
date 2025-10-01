import { getCurrentUserRequest } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export const GET_CURRENT_USER_MUTATION_KEY = ["getCurrentUser"];

export const useGetCurrentUser = () => {
  return useMutation({
    mutationKey: GET_CURRENT_USER_MUTATION_KEY,
    mutationFn: async () => await getCurrentUserRequest(),
  });
};
