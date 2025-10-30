import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";

import { ReserveInfo } from "@/components/layouts/reserve/ReserveInfo";

import {
  getRequestGroupByIdAdmin,
  type RequestGroupAdminResponse,
} from "@/api/request";

import type { ReservationEvent } from "@/components/display/reservationEvents";
import type {
  ReserveParticipant,
  ReserveSummaryExperience,
  ReserveParticipantGender,
} from "@/types/reserve";

export const Route = createFileRoute(
  "/admin/requests/$requestId"
)({
  // garante que requestId é valido pelo uuid
  parseParams: (params: any) => ({
    requestId: z
      .string()
      .uuid("ID de request inválido.")
      .parse(params.requestId),
  }),
  validateSearch: z
    .object({
      lang: z.enum(["pt", "en"]).optional(),
    })
    .optional(),
  component: ReserveInfoPage,
});

function ReserveInfoPage() {
  const navigate = useNavigate();
  const { requestId } = useParams({ from: Route.id });

  const [request, setRequest] =
    useState<RequestGroupAdminResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequestData() {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Usuário não autenticado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      const response = await getRequestGroupByIdAdmin(requestId, token);

      if (response.statusCode === 200 && response.data) {
        setRequest(response.data);
      } else {
        setError(
          response.message || "Ocorreu um erro ao buscar os dados da request."
        );
      }

      setIsLoading(false);
    }

    fetchRequestData();
  }, [requestId]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        Carregando informações da request...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">Erro: {error}</div>;
  }

  if (!request) {
    return (
      <div className="p-8 text-center">
        Nenhuma informação da request foi encontrada.
      </div>
    );
  }

  const normalizeGender = (g?: string | null): ReserveParticipantGender => {
    if (!g) return "NOT_INFORMED";
    const v = String(g).trim().toUpperCase();
    if (v === "MALE" || v === "M" || v === "MAN") return "MALE";
    if (v === "FEMALE" || v === "F" || v === "WOMAN") return "FEMALE";
    if (v === "OTHER") return "OTHER";
    return "NOT_INFORMED";
  };

  //formatar a data
  const formatDateForInput = (date?: string | Date | null): string => {
    if (!date) return "";

    try {
      if (typeof date === "string" && date.includes("T")) {
        return date.split("T")[0];
      }

      const d = typeof date === "string" ? new Date(date) : date;
      if (isNaN(d.getTime())) return "";

      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const participants: ReserveParticipant[] = (request.members || [])
    .filter((member) => member)
    .map((member) => ({
      id: member.id || member.document || member.name || "unknown",
      name: member.name || "Não informado",
      phone: member.phone?.replace(/^\+/, "") || "Não informado",
      birthDate: formatDateForInput(member.birthDate),
      cpf: member.document || "Não informado",
      gender: normalizeGender(member.gender),
    }));

  const experiences: ReserveSummaryExperience[] = request.reservations
    .filter((res) => res.experience)
    .map((res) => ({
      title: res.experience?.name || "Experiência sem nome",
      startDate: res.experience?.startDate
        ? new Date(res.experience.startDate).toLocaleDateString("pt-BR")
        : "N/A",
      endDate: res.experience?.endDate
        ? new Date(res.experience.endDate).toLocaleDateString("pt-BR")
        : "N/A",
      price: Number(res.experience?.price) || 0,
      peopleCount: request.members?.length || 0,
      imageUrl: res.experience?.image?.url || "N/A",
    }));

  const events: ReservationEvent[] = (request.requests || []).map(
    (req, index) => ({
      id: req.id || `event-${index}`,
      user: "Usuário",
      status: `${req.type}${req.description ? `: ${req.description}` : ``}`,
      date: "Data indisponível",
      time: "",
      avatarUrl: undefined,
    })
  );

  console.log("request.requests", request.requests);

  const notes =
    request.reservations
      .map((r) => r.notes)
      .filter(Boolean)
      .join("\n") || "Sem observações";

  return (
    <ReserveInfo
      title={`Request de ${request.user?.name || `N/A`}`}
      participants={participants}
      experiences={experiences}
      events={events}
      notes={notes}
      onBack={() => navigate({ to: "/admin/requests" })}
    />
  );
}
