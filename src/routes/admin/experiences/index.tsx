import DataTable from "@/components/table";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { type ChangeEvent, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFetchAdminExperiences } from '@/hooks/use-fetch-admin-experiences';
import type { TExperienceAdminRequestFilters } from '@/entities/experiences-admin-filters';
import type { TExperienceAdminResponse } from '@/entities/experiences-admin-response';
import { MoonLoader } from "react-spinners";

export const Route = createFileRoute("/admin/experiences/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { filters, setFilter } = useFilters<TExperienceAdminRequestFilters>({
    key: "get-admin-experience",
    initialFilters: {
      limit: 10,
      page: 0,
    },
  });
  const { items, meta, isLoading } = useFetchAdminExperiences({ filters });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilter("name", debouncedSearchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "description",
      header: "Descrição",
      enableSorting: true,
    },
    {
      accessorKey: "date",
      header: "Data",
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: false,
      size: 50,
      cell: ({ row }: { row: { original: TExperienceAdminResponse & { date?: string } } }) => {
        const experienceId = row.original.id;
        if (!experienceId) return null;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="size-5 p-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="cursor-pointer gap-4"
                onClick={() => navigate({ to: "/admin/experiences/$experienceId", params: { experienceId } })}
              >
                {"Editar"}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500 gap-3">
                {"Excluir"}
                <Trash className="size-4 text-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const navigateToCreateExperience = () => {
    void navigate({ to: "/admin/experiences/create" });
  };

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6">
      <div className="flex justify-between items-center">
        <Input
          value={searchTerm}
          className="w-1/3 h-12"
          placeholder="Buscar por nome"
          onChange={onChangeSearch}
        />
        <Button
          onClick={navigateToCreateExperience}
          className="bg-contrast-green h-12 hover:bg-contrast-green/90 active:bg-contrast-green/70"
        >
          <Typography className="text-white" variant="body">
            Criar Nova Experiência
          </Typography>
        </Button>
      </div>
      <div className="relative">
      {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/70 backdrop-blur-sm rounded-lg z-10">
            <MoonLoader size={35} color="#22c55e" />
          </div>
          )}
      <DataTable
        data={items}
        columns={columns}
        filters={filters}
        meta={meta}
        setFilter={setFilter}
      />
      </div>
    </div>
  );
}
