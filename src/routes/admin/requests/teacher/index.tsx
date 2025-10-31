import AdminRequests from "@/components/table/adminRequests";
import { useTeacherRequests } from "@/api/request";
import { useState } from "react";
import type { TRequestAdminFilters } from "@/entities/request-admin-filters";
import z from "zod";
import { createFileRoute } from "@tanstack/react-router"


export const Route = createFileRoute('/admin/requests/teacher/')({
  validateSearch: z
      .object({
        lang: z.enum(["pt", "en"]).optional(),
      })
      .optional(),
    component: TeacherRequestRoute,
})

function TeacherRequestRoute() {
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState<TRequestAdminFilters>({
    page: 1,
    limit: 10,
    status: undefined,
  });

  const { data, isLoading, error } = useTeacherRequests(
    filters,
    token ?? undefined
  );

  if (isLoading) {
    return <div className="p-6">Carregando solicitações...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        Erro ao carregar solicitações do servidor.
      </div>
    );
  }

  return <AdminRequests initialData={data} onFilterChange={setFilters} />;
}