import { DefaultButton } from '@/components/buttons';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Dialog, DialogHeader, DialogContent, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import type { ColumnDef } from '@tanstack/react-table';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';
import { useSearchUsers } from '@/hooks/useSearchUser';

export const Route = createFileRoute('/admin/users/')({
  component: RouteComponent,
})

type UserInfo = {
  id: string,
  name: string,
  email: string,
  createdBy: string
}


const demoData: UserInfo[] = Array.from({ length: 57 }).map((_, i) => ({
  id: crypto.randomUUID(),
  name: `User ${i + 1} da Silva Silva`,
  email: `user${i + 1}@example.com`,
  createdBy: `Kayky`,
}))


const demoColumns: ColumnDef<UserInfo>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "createdBy",
    header: "Criado por",
  },
]

type AdminUserRowActionsProps = {
  onEdit: () => void,
  onDelete: () => void,
}

function AdminUserRowActions({ onEdit, onDelete }: AdminUserRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white">
        <DropdownMenuItem onClick={onEdit} className="flex justify-end">Editar <Edit /></DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="flex justify-end">
          Excluír <Trash />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}

function RouteComponent() {
  const navigate = useNavigate()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    mutate: deleteUserMutate,
    isPending: deleteUserIsPending,
    isError: deleteUserIsError,
    error: deleteUserError
  } = useDeleteUser();

  const {
    isPending: searchUserIsPending
  } = useSearchUsers({ filter, page, pageSize });

  if (deleteUserIsError) {
    toast.error(deleteUserError.message)
  }

  const deleteUser = () => {
    deleteUserMutate(selectedUser?.id ?? "")
  }

  return (
    <div className="w-full flex justify-center">
      <div className="p-4 sm:p-6 w-300">
        <DataTable<UserInfo, unknown>
          data={demoData}
          columns={demoColumns}
          globalFilterPlaceholder="Filtrar usuários por nome ou email..."
          renderActions={(row) => (
            <AdminUserRowActions
              onEdit={() => {
                navigate({
                  to: "/admin/users/$userId", params: {
                    userId: row.original.id
                  }
                })
              }}
              onDelete={() => {
                setSelectedUser(row.original)
                setOpenDeleteDialog(true)
              }}
            />
          )}
          trailingHeader={<DefaultButton label="Criar novo usuário" className="w-40" />}
          globalFilter={filter}
          setGlobalFilter={setFilter}
        />
      </div>

      <Dialog open={openDeleteDialog}>
        <DialogContent className="bg-white" onClickCloseButton={() => setOpenDeleteDialog(false)}>
          <DialogHeader>
            <DialogTitle>Você tem certeza que deseja excluír este usuário?</DialogTitle>
            <DialogDescription>
              Confirmando essa operaćão você excluirá o usuário <b>{selectedUser?.name}</b> ({selectedUser?.email}).
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end">
            {deleteUserIsPending ? <SpinnerCircular color={"red"} size={"30"} /> :
              <Button onClick={deleteUser} type="button" variant="destructive" className="bg-red-500 hover:bg-red-400 flex" disabled={deleteUserIsPending}>
                Excluír
              </Button>
            }
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
