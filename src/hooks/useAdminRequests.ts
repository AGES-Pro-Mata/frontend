
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

async function fetchRequests({ page = 1, limit = 10, status }: { page?: number; limit?: number; status?: string }) {
  const params: any = { page, limit };
  if (status) params.status = status;
  const response = await axios.get("/api/requests", { params });
  return response.data;
}

export function useAdminRequests(filters: { page?: number; limit?: number; status?: string }) {
  const queryClient = useQueryClient();

  const requestsQuery = useQuery({
    queryKey: ["adminRequests", filters],
    queryFn: () => fetchRequests(filters)
  });

  // Exemplo de mutation para aprovar (ajuste endpoint se necessário)
  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.post(`/api/requests/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminRequests"] });
    },
  });

  return {
    requestsQuery,
    approveMutation,
    reservationStatus,
  };
}