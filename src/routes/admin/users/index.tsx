import DataTable from "@/components/table";
import type { TUserAdminRequestFilters } from "@/entities/user-admin-filters";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useFetchAdminUsers } from "../../../hooks/use-fetch-admin-users";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Edit, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilters<TUserAdminRequestFilters>({
    key: "get-admin-users",
    initialFilters: {
      limit: 10,
      page: 0,
      sort: "email",
      dir: "asc",
    },
  });
  const { items, meta } = useFetchAdminUsers({ filters });

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "createdBy",
      header: "Criado por",
      enableSorting: true,
      cell: ({ row }: any) => {
        const createdBy = row.original.createdBy;
        return createdBy?.name || "-";
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      size: 50,
      cell: () => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="size-5 p-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer gap-4">
                {"Editar"}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const navigateToCreateUser = () => {
    navigate({ to: "/admin/users/create" });
  };

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6">
      <div className="flex justify-end items-center">
        <Button
          onClick={navigateToCreateUser}
          className="bg-contrast-green h-12 hover:bg-contrast-green/90 active:bg-contrast-green/70"
        >
          <Typography className="text-white" variant="body">
            Criar Novo Usuário
          </Typography>
        </Button>
      </div>
      <DataTable
        data={items}
        columns={columns}
        filters={filters}
        meta={meta}
        setFilter={setFilter}
      />
    </div>
  );
}
