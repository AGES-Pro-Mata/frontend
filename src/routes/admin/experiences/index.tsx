import DataTable from "@/components/table";
import { useFilters } from "@/hooks/filters/filters";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import { CalendarIcon, Edit, Eye, EyeOff, MoreHorizontal, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type ChangeEvent, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TExperienceAdminRequestFilters } from "@/entities/experiences-admin-filters";
import type { TExperienceAdminResponse } from "@/entities/experiences-admin-response";
import { MoonLoader } from "react-spinners";
import {
  useDebounce,
  useDeleteExperience,
  useFetchAdminExperiences,
  useToggleExperienceStatus,
} from "@/hooks";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  EXPERIENCE_CATEGORY_LABEL,
  EXPERIENCE_CATEGORY_STYLE_COLOR,
  ExperienceCategory,
} from "@/types/experience";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

export const Route = createFileRoute("/admin/experiences/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
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
  const deleteExperienceMutation = useDeleteExperience();
  const toggleStatusMutation = useToggleExperienceStatus();

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setFilter("startDate", dateRange.from.toISOString());
      setFilter("endDate", dateRange.to.toISOString());
    } else {
      setFilter("startDate", undefined);
      setFilter("endDate", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilter("name", debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteExperience = (experienceId: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta experiência? Esta ação não pode ser desfeita.",
      )
    ) {
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
      header: "Nome",
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
      cell: ({ row }: { row: { original: TExperienceAdminResponse & { date?: string } } }) => {
        if (!row.original.startDate || !row.original.endDate) {
          return "Sem intervalo de datas";
        }

        return `${dayjs(row.original.startDate).format("DD/MM/YYYY")} - ${dayjs(row.original.endDate).format("DD/MM/YYYY")}`;
      },
    },
    {
      accessorKey: "category",
      header: "Tipo",
      enableSorting: false,
      size: 80,
      cell: ({ row }: { row: { original: TExperienceAdminResponse } }) => {
        return (
          <Typography
            className={cn(
              "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
              EXPERIENCE_CATEGORY_STYLE_COLOR[row.original.category as ExperienceCategory],
            )}
          >
            {t(
              EXPERIENCE_CATEGORY_LABEL[row.original.category as ExperienceCategory],
            ).toUpperCase()}
          </Typography>
        );
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      enableSorting: false,
      size: 80,
      cell: ({ row }: { row: { original: TExperienceAdminResponse } }) => {
        const isActive = row.original.active ?? true;

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
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
                onClick={() =>
                  void navigate({
                    to: "/admin/experiences/$experienceId",
                    params: { experienceId },
                  })
                }
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

  const navigateToCreateExperience = () => {
    void navigate({ to: "/admin/experiences/create" });
  };

  const handleChangeStatusFilter = (category: string[]) => {
    setFilter("category", category as ExperienceCategory[]);
  };

  const selectOptions = Object.values(ExperienceCategory).map((experience) => {
    return { label: t(EXPERIENCE_CATEGORY_LABEL[experience]), value: experience };
  });

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6 overflow-hidden">
      <div className="flex justify-between items-center gap-6">
        <Input
          value={searchTerm}
          className="w-1/3 h-12"
          placeholder="Buscar por nome"
          onChange={onChangeSearch}
        />
        <MultiSelect
          onChange={handleChangeStatusFilter}
          value={(filters.category as string[]) ?? []}
          options={selectOptions}
          placeholder="Selecionar Tipos..."
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 flex items-center gap-2">
              <CalendarIcon className="size-4" />
              {dateRange?.from && dateRange?.to
                ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`
                : "Filtrar por Data"}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Button
          onClick={navigateToCreateExperience}
          className="ml-auto bg-contrast-green h-12 hover:bg-contrast-green/90 active:bg-contrast-green/70"
        >
          <Typography className="text-white" variant="body">
            Criar Nova Experiência
          </Typography>
        </Button>
      </div>
      <div className="relative flex-1 overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex justify-center items-center z-10">
            <MoonLoader size={35} color="#22c55e" />
          </div>
        )}
        <DataTable
          data={items}
          columns={columns}
          filters={filters}
          isLoading={isLoading}
          meta={meta}
          setFilter={setFilter}
        />
      </div>
    </div>
  );
}
