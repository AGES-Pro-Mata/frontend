import { DataTable, type TAction } from '@/components/ui/data-table';
import { DefaultButton } from '@/components/ui/defaultButton';
import { createFileRoute } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash } from 'lucide-react';

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
})

export type Payment = {
  name: string,
  createdBy: string,
  email: string,
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "createdBy",
    header: "Criado por",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]

const data: Payment[] = [
  {
    name: 'Kayky',
    createdBy: 'Andre',
    email: 'kayky@admin.com'
  },
]

const actions: TAction[] = [
  {
    node: (
      <div className="flex justify-between items-center p-1 w-full">
        Editar
        <Edit />
      </div>
    ),
    action: (row) => { console.log("Editar", row) }
  },
  {
    node: (
      <div className="flex justify-between items-center p-1 w-full">
        Excluir
        <Trash />
      </div>
    ),
    action: (row) => { console.log("Remover", row) }
  },
]

function RouteComponent() {
  return (<div className="flex justify-center w-full"><div className="p-6 max-w-5xl min-w-5xl">
    <div className="flex w-full justify-end">
      <DefaultButton label="Criar novo usuário" className="w-40" />
    </div>
    <div className="overflow-hidden rounded-md border mt-5">
      <DataTable<Payment, unknown> columns={columns} data={data} actions={actions} />
    </div>
  </div></div>);
}
