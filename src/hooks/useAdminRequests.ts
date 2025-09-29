import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

async function fetchProfessorRequests() {
  const response = await axios.get("/api/admin/professor-requests");
  return response.data;
}

async function fetchReservationRequests() {
  const response = await axios.get("/api/admin/reservation-requests");
  return response.data;
}

async function approveRequest(id: string) {
  const response = await axios.post(`/api/admin/requests/${id}/approve`);
  return response.data;
}

export function useAdminRequests() {
  const queryClient = useQueryClient();

  const professorQuery = useQuery({
    queryKey: ["professorRequests"],
    queryFn: fetchProfessorRequests,
  });

  const reservationQuery = useQuery({
    queryKey: ["reservationRequests"],
    queryFn: fetchReservationRequests,
  });

  const approveMutation = useMutation({
    mutationFn: approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professorRequests"] });
      queryClient.invalidateQueries({ queryKey: ["reservationRequests"] });
    },
  });

  return {
    professorQuery,
    reservationQuery,
    approveMutation,
  };
}