import DataTable from '@/components/table';
import { useFilters } from '@/hooks/filters/filters';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/typography';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFetchAdminExperiences } from '@/hooks/use-fetch-admin-experiences';
import type { TExperienceAdminRequestFilters } from '@/entities/experiences-admin-filters';
import { MoonLoader } from "react-spinners";

export const Route = createFileRoute('/admin/experiences/')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { filters, setFilter } = useFilters<TExperienceAdminRequestFilters>({
    key: 'get-admin-experience',
    initialFilters: {
      limit: 10,
      page: 0,
    },
  });
  const { items, meta, isFetching } = useFetchAdminExperiences({ filters });

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      enableSorting: true,
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      enableSorting: true,
    },
    {
      accessorKey: 'date',
      header: 'Data',
      enableSorting: true,
    },
    {
      id: 'actions',
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
                {'Editar'}
                <Edit className="size-4 text-black" />
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-red-500 gap-3">
                {'Excluir'}
                <Trash className="size-4 text-red-500" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const navigateToCreateExperience = () => {
    navigate({ to: '/admin/experiences/create' });
  };

  if (isFetching) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[200px]">
        <MoonLoader size={40} color="#22c55e" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4 gap-6">
      <div className="flex justify-end items-center">
        <Button
          onClick={navigateToCreateExperience}
          className="bg-contrast-green h-12 hover:bg-contrast-green/90 active:bg-contrast-green/70"
        >
          <Typography className="text-white" variant="body">
            Criar Nova Experiência
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
