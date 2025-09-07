import { useState } from "react";
import { ProfessorProfileCard } from "@/components/cards/professorProfileCard";
import type { RegisterUserAdminPayload } from "@/api/user";
import ProfessorApproval from "@/components/text-areas/acceptRequest";
import { Button } from "@/components/buttons/defaultButton";
import { Link } from "@tanstack/react-router";

interface ApproveProfessorCardProps {
  professor: RegisterUserAdminPayload;
}

export function ApproveProfessorCard({ professor }: ApproveProfessorCardProps) {
  const [markdown, setMarkdown] = useState<string>("");

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
