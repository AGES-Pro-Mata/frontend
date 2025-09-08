import { useState } from "react";
import { ProfessorProfileCard } from "@/components/cards/professorProfileCard";
import type { RegisterUserPayload } from "@/api/user";
import { approveOrRejectProfessor } from "@/api/professor";
import { toast } from "sonner";
import ProfessorApproval from "@/components/text-areas/acceptRequest";
import { Button } from "@/components/buttons/defaultButton";
import { Link } from "@tanstack/react-router";

interface ApproveProfessorCardProps {
  professor: RegisterUserPayload;
  professorId: string;
}

export function ApproveProfessorCard({
  professor,
  professorId,
}: ApproveProfessorCardProps) {
  const [markdown, setMarkdown] = useState<string>("");

  // Handlers para as ações

  const handleApprove = async (obs: string) => {
    const res = await approveOrRejectProfessor({
      id: professorId,
      approved: true,
      observation: obs,
    });
    if (res.statusCode === 200) {
      toast.success("Professor aprovado!", {
        style: { background: "var(--color-contrast-green)", color: "white" },
      });
    } else {
      toast.error("Erro ao aprovar professor", {
        style: { background: "var(--color-default-red)", color: "white" },
      });
    }
  };

  const handleReject = async (obs: string) => {
    const res = await approveOrRejectProfessor({
      id: professorId,
      approved: false,
      observation: obs,
    });
    if (res.statusCode === 200) {
      toast.success("Professor recusado!", {
        style: { background: "var(--color-contrast-green)", color: "white" },
      });
    } else {
      toast.error("Erro ao recusar professor", {
        style: { background: "var(--color-default-red)", color: "white" },
      });
    }
  };

  const handleViewReceipt = () => {
    // TODO: implementar visualização de comprovante
    toast.success("Visualizar comprovante (ação mock)");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-16 w-full p-2 md:p-3 min-h-0">
      <div className="flex-1 flex items-stretch justify-end min-h-0 h-full max-w-full">
        <ProfessorProfileCard professor={professor} />
      </div>
      <div className="flex-1 flex items-stretch min-h-0 max-w-full">
        <div className="relative w-full rounded-xl flex flex-col min-h-0 h-full max-w-full">
          <div className="flex-1 min-h-0 h-full overflow-y-auto max-w-full">
            <ProfessorApproval
              markdown={markdown}
              setMarkdown={setMarkdown}
              placeholder="Digite alguma observação sobre essa solicitação"
              onApprove={handleApprove}
              onReject={handleReject}
              onViewReceipt={handleViewReceipt}
            />
          </div>
        </div>
        <div className="absolute bottom-15 right-15 select-none pointer-events-none">
          <Link to="/admin/requests" className="pointer-events-auto">
            <Button
              variant="ghost"
              label="Voltar"
              className="text-lg font-bold hover:bg-transparent focus:bg-transparent active:bg-transparent"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
