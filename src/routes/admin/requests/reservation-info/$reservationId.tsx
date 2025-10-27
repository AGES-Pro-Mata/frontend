import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { ReserveInfo } from "@/components/layouts/reserve/ReserveInfo";

import {
  getReservationGroupByIdAdmin,
  type ReservationGroupAdminResponse,
} from "@/api/reservation";

import type { ReservationEvent } from "@/components/display/reservationEvents";
import type {
  ReserveParticipant,
  ReserveSummaryExperience,
  ReserveParticipantGender,
} from "@/types/reserve";

export const Route = createFileRoute("/admin/requests/reservation-info/$reservationId")({
    // garante que reservationId é valido pelo uuid
  parseParams: (params: any) => ({
    reservationId: z
      .string()
      .uuid("ID de reserva inválido.")
      .parse(params.reservationId),
  }),
  component: ReserveInfoPage,
});

function ReserveInfoPage() {
  const navigate = useNavigate();
  const { reservationId } = useParams({ from: Route.id }); 

  const [reservation, setReservation] = useState<ReservationGroupAdminResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReservationData() {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const response = await getReservationGroupByIdAdmin(reservationId, token);

      if (response.statusCode === 200 && response.data) {
        setReservation(response.data);
      } else {
        setError(response.message || "Ocorreu um erro ao buscar os dados da reserva.");
      }

      setIsLoading(false);
    }

    fetchReservationData();
  }, [reservationId]);

  if (isLoading) {
    return <div className="p-8 text-center">Carregando informações da reserva...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  }

  if (!reservation) {
    return <div className="p-8 text-center">Nenhuma informação da reserva foi encontrada.</div>;
  }

  const normalizeGender = (g?: string | null): ReserveParticipantGender => {
    if (!g) return "NOT_INFORMED";
    const v = String(g).trim().toUpperCase();
    if (v === "MALE" || v === "M" || v === "MAN") return "MALE";
    if (v === "FEMALE" || v === "F" || v === "WOMAN") return "FEMALE";
    if (v === "OTHER") return "OTHER";
    return "NOT_INFORMED";
  };

  // Members vem do ReservationGroup, não das Reservations individuais
  const participants: ReserveParticipant[] = (reservation.members || [])
    .filter((member) => member) // Remove membros null/undefined
    .map((member) => ({
      id: member.id || member.document || member.name || "unknown",
      name: member.name || "Não informado",
      phone: (member as any).phone || "Não informado", //não está sendo enviado pelo back
      birthDate: (member as any).birthDate || "Não informado", //não está sendo enviado pelo back
      cpf: member.document || "Não informado",
      gender: normalizeGender(member.gender),
    }));

  const experiences: ReserveSummaryExperience[] = reservation.reservations
    .filter((res) => res.experience) // Filtra apenas reservas com experience válido
    .map((res) => ({
      title: res.experience?.name || "Experiência sem nome",
      startDate: res.experience?.startDate
        ? new Date(res.experience.startDate).toLocaleDateString("pt-BR")
        : "N/A",
      endDate: res.experience?.endDate
        ? new Date(res.experience.endDate).toLocaleDateString("pt-BR")
        : "N/A",
      price: Number(res.experience?.price) || 0,
      peopleCount: reservation.members?.length || 0,
      imageUrl: "/mock/landscape-placeholder.webp", //imagem não está sendo enviada pelo back
    }));

  const events: ReservationEvent[] = (reservation.requests || []).map(
    (req, index) => ({
      id: req.id || `event-${index}`,
      user: "Usuário",
      status: `${req.type}${req.description ? `: ${req.description}` : ``}`,
      date: "Data indisponível",
      time: "",
      avatarUrl: undefined,
    })
  );

  const notes = reservation.reservations
    .map((r) => r.notes)
    .filter(Boolean)
    .join("\n") || "Sem observações";

  return (
    <ReserveInfo
      title={`Reserva de ${reservation.user?.name || `N/A`}`}
      participants={participants}
      experiences={experiences}
      events={events}
      notes={notes}
      onBack={() => navigate({ to: "/admin/requests" })}
    />
  );
}