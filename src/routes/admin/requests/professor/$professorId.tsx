import { Button } from "@/components/button/defaultButton";
import { ProfessorProfileCard } from "@/components/card/professorProfileCard";
import ProfessorApproval from "@/components/text-areas/reviewProfessorRequest";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/requests/professor/$professorId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { professorId } = Route.useParams();

  return (
    <div className="flex flex-col items-center">
      <ProfessorProfileCard id={professorId} />

      <div className="flex">
        <ProfessorApproval professorId={professorId} />
      </div>
      <div className="flex w-full justify-end">
        <Link to="/admin/requests" search={{ tab: "professor" }}>
          <Button type="button" variant="ghost" label="Voltar" />
        </Link>
      </div>
    </div>
  );
}
