import { useState, useCallback } from "react";
import { ReceiptPreview } from "@/components/dialogs/receiptPreview";
import { ProfessorProfileCard } from "@/components/cards/professorProfileCard";
import { approveOrRejectProfessor } from "@/api/professor";
import { appToast } from "@/components/toast/toast";
import ProfessorApproval from "@/components/text-areas/acceptRequest";
import { Button } from "@/components/buttons/defaultButton";
import { Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import type { HttpResponse } from "@/types/http-response";
import type { ProfessorApprovalPayload } from "@/api/professor";

interface ApproveProfessorCardProps {
  professor: ProfessorApprovalPayload;
}

export function ApproveProfessorCard({ professor }: ApproveProfessorCardProps) {
  const [markdown, setMarkdown] = useState<string>("");

  const mutation = useMutation<HttpResponse, Error, ProfessorApprovalPayload>({
    mutationKey: ["approve-professor"],
    mutationFn: approveOrRejectProfessor,
    onSuccess: (res) => {
      const ok = res.statusCode >= 200 && res.statusCode < 300;
      if (ok) {
        appToast.success("Operação realizada com sucesso!");
      } else {
        appToast.error("Erro na operação");
      }
    },
    onError: () => {
      appToast.error("Erro na operação");
    },
  });

  const submit = useCallback(
    (approved: boolean, observation: string) => {
      if (mutation.isPending) return; // evita cliques duplos
      mutation.mutate({
        ...professor,
        approved,
        observation,
      });
    },
    [mutation, professor]
  );

  const [openReceipt, setOpenReceipt] = useState(false);
  const handleViewReceipt = () => {
    setOpenReceipt(true);
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
              onApprove={(obs) => submit(true, obs)}
              onReject={(obs) => submit(false, obs)}
              onViewReceipt={handleViewReceipt}
            />
          </div>
        </div>
        <div className="absolute bottom-15 right-15 select-none pointer-events-none">
          <Link
            to="/admin/requests"
            preload="intent"
            className="pointer-events-auto"
          >
            <Button
              variant="ghost"
              label="Voltar"
              className="text-lg font-bold hover:bg-transparent focus:bg-transparent active:bg-transparent"
              disabled={mutation.isPending}
            />
          </Link>
        </div>
      </div>
      <ReceiptPreview
        src="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"
        open={openReceipt}
        onOpenChange={setOpenReceipt}
        title="Comprovante do Professor"
        downloadFileName={`comprovante-${professor.id || "professor"}`}
        height="80vh"
        className="max-w-7xl"
      />
    </div>
  );
}
