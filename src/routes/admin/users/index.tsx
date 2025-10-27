import DataTable from "@/components/table";
import { Typography } from "@/components/typography";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { TUserAdminRequestFilters } from "@/entities/user-admin-filters";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useFetchAdminUsers } from "../../../hooks/use-fetch-admin-users";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDeleteUser } from "@/hooks/use-delete-users";
import { type ChangeEvent, useState } from "react";

const PLACE_HOLDER_TRANSLATE_TEXT = {
  ["name"]: "Nome",
  ["email"]: "Email",
  ["createdBy"]: "Criador",
} as const;

type FilterKey = keyof typeof PLACE_HOLDER_TRANSLATE_TEXT;

export const Route = createFileRoute("/admin/users/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>("name");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const {
    filters,
    setFilter,
    reset: resetFilters,
  } = useFilters<TUserAdminRequestFilters>({
    key: "get-admin-users",
    initialFilters: {
      limit: 10,
      page: 0,
    },
  });

  const { items, meta } = useFetchAdminUsers({ filters });
  const { handleDeleteUser } = useDeleteUser();

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);
    setFilter(selectedFilter, value);
  };

  const onChangeFilter = (value: FilterKey) => {
    if (!value) return;
    resetFilters();
    setSearchTerm("");
    setSelectedFilter(value);
  };

  const handleDeleteUserClick = async (id: string) => {
    await handleDeleteUser(id);
  };

  const handleEditUserClick = (userId: string) => {
    void navigate({ to: "/admin/users/$userId", params: { userId } });
  };

  const navigateToCreateUser = () => {
    void navigate({ to: "/admin/users/create" });
  };

  const searchInputPlaceholder = `Buscar por ${PLACE_HOLDER_TRANSLATE_TEXT[selectedFilter]}`;
  const columns = [
    {
      accessorKey: "name",
      header: "Nome",
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
      cell: ({ row }: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="size-5 p-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleEditUserClick(row.original.id)}
                className="cursor-pointer gap-4"
              >
                {"Editar"}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteUserClick(row.original.id)}
                className="cursor-pointer text-red-500 gap-3"
              >
                {"Excluir"}
                <Trash className="size-4 text-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6">
      <div className="flex justify-between items-center">
        <div className="w-full flex gap-4">
          <Input
            value={searchTerm}
            className="w-1/3 h-12"
            placeholder={searchInputPlaceholder}
            onChange={onChangeSearch}
          />
          <ToggleGroup
            type="single"
            value={selectedFilter}
            onValueChange={onChangeFilter}
            className="gap-2 w-1/2"
          >
            <ToggleGroupItem
              className="border-1 h-12 !rounded-full !w-auto data-[state=on]:bg-contrast-green data-[state=on]:text-white"
              value="name"
            >
              Nome
            </ToggleGroupItem>
            <ToggleGroupItem
              className="border-1 h-12 !rounded-full !w-auto data-[state=on]:bg-contrast-green data-[state=on]:text-white"
              value="createdBy"
            >
              Criado Por
            </ToggleGroupItem>
            <ToggleGroupItem
              className="border-1 h-12 !rounded-full !w-auto data-[state=on]:bg-contrast-green data-[state=on]:text-white"
              value="email"
            >
              Email
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
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
