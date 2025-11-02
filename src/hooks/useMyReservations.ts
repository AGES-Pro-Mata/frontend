import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useMyReservations() {
  return useQuery({
    queryKey: ["myReservations"],
    queryFn: async () => {
      const res = await axios.get("/api/minhas-reservas");

      return res.data.data || res.data || [];
    },
  });
}