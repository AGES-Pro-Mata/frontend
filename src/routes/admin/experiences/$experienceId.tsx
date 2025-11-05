import { createFileRoute } from '@tanstack/react-router';
import { EditExperience } from '@/components/forms';

export const Route = createFileRoute('/admin/experiences/$experienceId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { experienceId } = Route.useParams();

  return (
    <div className="w-full">
      <EditExperience experienceId={experienceId} />
    </div>
  );
}
