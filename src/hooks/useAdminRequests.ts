import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/core/api";
const reservationStatus = [
  "CREATED",
  "CANCELED",
  "CANCELED_REQUESTED",
  "EDITED",
  "REJECTED",
  "APPROVED",
  "PEOPLE_REQUESTED",
  "PAYMENT_REQUESTED",
  "PEOPLE_SENT",
  "PAYMENT_SENT",
];

async function fetchRequests({
  page = 1,
  limit = 10,
  status,
}: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const params = { page, limit, status };

  if (status) params.status = status;
  const response = await api.get("/api/requests", { params });

  return response.data;
}

export function useAdminRequests(filters: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ["adminRequests", filters],
    queryFn: () => fetchRequests(filters)
  });

  // Exemplo de mutation para aprovar (ajuste endpoint se necessário)
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/api/requests/${id}/approve`);

      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["adminRequests"] });
    },
  });

  return {
    requestsQuery,
    approveMutation,
    reservationStatus,
  };
}

