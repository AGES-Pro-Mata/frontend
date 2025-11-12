import DataTable from "@/components/table";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { Edit, Eye, EyeOff, MoreHorizontal, Trash } from "lucide-react";
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
import { useDeleteExperience } from '@/hooks/useDeleteExperience';
import { useToggleExperienceStatus } from '@/hooks/useToggleExperienceStatus';
import type { TExperienceAdminRequestFilters } from '@/entities/experiences-admin-filters';
import type { TExperienceAdminResponse } from '@/entities/experiences-admin-response';
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";


export const Route = createFileRoute("/admin/experiences/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { t } = useTranslation(); 
  const [searchTerm, setSearchTerm] = useState("");
  const { filters, setFilter } = useFilters<TExperienceAdminRequestFilters>({
    key: "get-admin-experience",
    initialFilters: {
      limit: 10,
      page: 0,
    },
  });
  const { items, meta, isLoading } = useFetchAdminExperiences({ filters });
  const deleteExperienceMutation = useDeleteExperience();
  const toggleStatusMutation = useToggleExperienceStatus();

  const tiposUnicos: string[] = Array.from(
  new Set(items.map((item) => item.category ?? "Não Informado"))
);



  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilter("name", debouncedSearchTerm);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteExperience = (experienceId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta experiência? Esta ação não pode ser desfeita.")) {
      deleteExperienceMutation.mutate(experienceId);
    }
  };

  const handleToggleStatus = (experienceId: string, currentActive: boolean) => {
    const action = currentActive ? "desativar" : "ativar";

    if (window.confirm(`Tem certeza que deseja ${action} esta experiência?`)) {
      toggleStatusMutation.mutate({ experienceId, active: !currentActive });
    }
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
  accessorKey: "category",
  header: "Categoria",
  enableSorting: true,
  cell: ({ row }: { row: { original: TExperienceAdminResponse } }) => {
    const category = row.original.category ?? "unknown";

    const mapCategory: Record<string, string> = {
      LABORATORY: "lab",
      LAB: "lab",
      TRAIL: "trail",
      EVENT: "event",
      HOSTING: "room",
    };

    const normalized = mapCategory[category] ?? category.toLowerCase();
    const translated = t(`experienceCategories.${normalized}`, {
      defaultValue: category,
    });

    return (
      <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 capitalize">
        {translated}
      </span>
    );
  },

    },
    {
      accessorKey: "active",
      header: "Status",
      enableSorting: true,
      cell: ({ row }: { row: { original: TExperienceAdminResponse } }) => {
        const isActive = row.original.active ?? true;

        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {isActive ? "Ativa" : "Inativa"}
          </span>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      size: 50,
      cell: ({ row }: { row: { original: TExperienceAdminResponse & { date?: string } } }) => {
        const experienceId = row.original.id;
        const isActive = row.original.active ?? true;

        if (!experienceId) return null;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MoreHorizontal className="size-5 p-0 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="cursor-pointer gap-4"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={() => navigate({ to: "/admin/experiences/$experienceId", params: { experienceId } })}
              >
                {"Editar"}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer gap-4"
                onClick={() => handleToggleStatus(experienceId, isActive)}
              >
                {isActive ? "Desativar" : "Ativar"}
                {isActive ? (
                  <EyeOff className="size-4 text-orange-500" />
                ) : (
                  <Eye className="size-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-500 gap-3"
                onClick={() => handleDeleteExperience(experienceId)}
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

  const [filterTipos, setFilterTipos] = useState<string[]>([]);

  const toggleTipo = (tipo: string) => {
    setFilterTipos((prev) =>
      prev.includes(tipo)
        ? prev.filter((t) => t !== tipo) 
        : [...prev, tipo]               
    );
  };

  
  const filteredItems =
  filterTipos.length > 0
    ? items.filter((item) =>
        filterTipos.includes(item.category ?? "Não Informado")
      )
    : items;




  const navigateToCreateExperience = () => {
    void navigate({ to: "/admin/experiences/create" });
  };


  return (
    <div className="flex flex-col w-full h-full p-4 gap-6">
      <div className="flex items-center gap-4">
        <Input
          value={searchTerm}
          className="w-1/3 h-12"
          placeholder="Buscar por nome"
          onChange={onChangeSearch}
        />
         <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-12" >
              {filterTipos.length === 0
                ? "Filtrar por Tipo"
                : `Tipos (${filterTipos.length})`}
            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterTipos([])}>
              Todos
            </DropdownMenuItem>

{tiposUnicos.map((tipo) => {
  const mapCategory: Record<string, string> = {
    LABORATORY: "lab",
    LAB: "lab",
    TRAIL: "trail",
    EVENT: "event",
    HOSTING: "room",
  };

  const normalized = mapCategory[tipo] ?? tipo.toLowerCase();
  const translated = t(`experienceCategories.${normalized}`, { defaultValue: tipo });

  return (
    <DropdownMenuItem
      key={tipo}
      onClick={() => toggleTipo(tipo)}
      className={filterTipos.includes(tipo) ? "bg-gray-200" : ""}
    >
      {translated}
    </DropdownMenuItem>
  );
})}



          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={navigateToCreateExperience}
            className="ml-auto bg-contrast-green h-12 hover:bg-contrast-green/90 active:bg-contrast-green/70"
        >
          <Typography className="text-white" variant="body">
            Criar Nova Experiência
          </Typography>
        </Button>
      </div>
      <div className="relative">
      {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center bg-black/10 z-10">
            <MoonLoader size={35} color="#22c55e" />
          </div>
          )}
      <DataTable
        data={filteredItems}
        columns={columns}
        filters={filters}
        meta={meta}
        setFilter={setFilter}
      />
      </div>
    </div>
  );
}
