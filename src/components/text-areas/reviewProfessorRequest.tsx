/* eslint-disable @typescript-eslint/no-misused-promises */
import { type ReactElement, createElement, useState } from "react";
import { Button } from "../button/defaultButton";
import { Textarea } from "../ui/textarea";
import {
  GET_PROFESSOR_REQUESTS_QUERY_KEY,
  useGetProfessorRequest,
} from "@/hooks/requests/use-get-professor-request-admin";
import { ProfessorRequestsType } from "@/utils/enums/requests-enum";
import { useCreateAdminRequest } from "@/hooks/requests/use-create-request-admin";
import { useQueryClient } from "@tanstack/react-query";
import { appToast } from "../toast/toast";
import { CardStatus } from "../card";
import { CheckCircle2, Clock5, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { PROFESSOR_REQUESTS_LABEL } from "@/utils/consts/requests-consts";
import ReceiptPreview from "../dialog/receiptPreview";

type ProfessorStyle = {
  className: string;
  icon: ReactElement;
};
const STYLES = {
  [ProfessorRequestsType.DOCUMENT_APPROVED]: {
    className: "text-contrast-green",
    icon: createElement(CheckCircle2),
  },
  [ProfessorRequestsType.DOCUMENT_REJECTED]: {
    className: "text-default-red",
    icon: createElement(XCircle),
  },
  [ProfessorRequestsType.DOCUMENT_REQUESTED]: {
    className: "text-warning",
    icon: createElement(Clock5),
  },
} satisfies Record<ProfessorRequestsType, ProfessorStyle>;

interface ProfessorApprovalProps {
  professorId: string;
}

export default function ProfessorApproval({ professorId }: ProfessorApprovalProps) {
  const [openPdfModal, setOpenPdfModal] = useState(false);
  const { data } = useGetProfessorRequest(professorId);
  const { mutateAsync, isPending } = useCreateAdminRequest();
  const [text, setText] = useState(data?.description || "");
  const queryClient = useQueryClient();

  const canEdit = data?.type === ProfessorRequestsType.DOCUMENT_REQUESTED;

  const handleAprove = async () => {
    await mutateAsync({
      professorId,
      description: text === "" ? null : text,
      type: ProfessorRequestsType.DOCUMENT_APPROVED,
    }).finally(async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_PROFESSOR_REQUESTS_QUERY_KEY, professorId],
      });
      appToast.success("Professor ACEITO com sucesso!");
    });
  };

  const handleReject = async () => {
    await mutateAsync({
      professorId,
      description: text === "" ? null : text,
      type: ProfessorRequestsType.DOCUMENT_REJECTED,
    }).finally(async () => {
      await queryClient.refetchQueries({
        queryKey: [GET_PROFESSOR_REQUESTS_QUERY_KEY, professorId],
      });
      appToast.success("Professor RECUSADO com sucesso!");
    });
  };

  const handleViewPdf = () => {
    setOpenPdfModal(true);
  };
  const className = data?.type && STYLES[data.type]?.className ? STYLES[data.type].className : "";

  const icon = data?.type && STYLES[data.type]?.icon ? STYLES[data.type].icon : <></>;

  if (!data) return;

  return (
    <div className="flex flex-col min-w-[500px] gap-4">
      <div className="relative w-full flex">
        <Textarea
          disabled={!canEdit}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite uma observação"
          className="min-h-32 resize-none rounded-2xl border border-dark-gray/60 bg-white px-4 py-5 shadow-none focus-visible:ring-0"
        />
        <CardStatus
          icon={icon}
          label={PROFESSOR_REQUESTS_LABEL[data.type ?? ""]}
          className={cn("absolute bottom-2 right-2", className)}
        />
      </div>
      {canEdit && (
        <div className="flex gap-4 flex-row">
          <Button
            label={"Aprovar"}
            className="flex-1"
            onClick={handleAprove}
            disabled={isPending}
          />
          <Button
            label={"Rejeitar"}
            variant="destructive"
            className="flex-1"
            onClick={handleReject}
            disabled={isPending}
          />
        </div>
      )}
      <Button label={"Visualizar Comprovante"} variant="outline" onClick={handleViewPdf} />
      <ReceiptPreview
        src={data.fileUrl ?? ""}
        open={openPdfModal}
        onOpenChange={() => setOpenPdfModal(false)}
      />
    </div>
  );
}
