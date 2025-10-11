import { QueryClient } from "@tanstack/react-query";
import { getUserById } from "@/api/user";
import type { ProfessorApprovalDetails } from "@/api/professor";

export async function useGetProfessorById(id: string, context: any) {
  if (!id) throw new Response("Not Found", { status: 404 });

  const { queryClient } = context as { queryClient: QueryClient };
  await queryClient.ensureQueryData({
    queryKey: ["professor", id] as const,
    queryFn: async (): Promise<ProfessorApprovalDetails> => {
      const res = await getUserById(id);
      if (!res.data) {
        throw new Response("Professor not found", {
          status: res.statusCode || 404,
        });
      }
      return {
        id,
        ...res.data,
      } satisfies ProfessorApprovalDetails;
    },
  });
  return queryClient.getQueryData([
    "professor",
    id,
  ]) as ProfessorApprovalDetails;
}
