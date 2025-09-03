import { createFileRoute } from '@tanstack/react-router';
import { ProfessorProfileCard } from '../../features/professorApproval/components/ProfessorProfileCard';
import { ProfessorApprovalPanel } from '../../features/professorApproval/components/ProfessorApprovalPanel';

export const Route = createFileRoute('/professor-approval/')({
  component: ProfessorApprovalPage,
});

function ProfessorApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="flex gap-8 w-full max-w-5xl">
        <ProfessorProfileCard />
        <ProfessorApprovalPanel />
      </div>
    </div>
  );
}