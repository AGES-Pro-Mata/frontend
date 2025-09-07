import { searchUsers, type SearchUserPayload } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

export function useSearchUsers(payload: SearchUserPayload) {
  return useQuery({
    queryKey: ["searchUser", payload],
    queryFn: async () => {
      return await searchUsers(payload)
    }
  })
}
