import { createFileRoute } from '@tanstack/react-router'
import type { RegisterUserAdminPayload } from '@/api/user';
import { ApproveProfessorCard } from '@/components/cards/approveProfessorCard';
import { useParams } from '@tanstack/react-router';
import { useProfessorById } from '@/hooks/useProfessor';

export const Route = createFileRoute('/admin/requests/professor-approval/$professor-id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { "professor-id": professorId } = useParams({ strict: false });
  const { data, isLoading } = useProfessorById(professorId as string);

  if (isLoading) return <div>Carregando...</div>;
  if (!data?.data) {
    throw new Response('Not Found', { status: 404 });
  }

  return <ApproveProfessorCard professor={data.data as RegisterUserAdminPayload} />;
}
