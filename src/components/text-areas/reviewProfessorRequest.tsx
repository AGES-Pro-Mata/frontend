import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "../button/defaultButton";
import { Textarea } from "../ui/textarea";
import { MarkdownTextArea } from "./markdownTextArea";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types/user";

interface ProfessorApprovalProps {
  markdown: string;
  placeholder?: string;
  setMarkdown: (value: string) => void;
  userType: UserType;
  statusVersion?: number;
  onApprove?: (markdown: string) => void;
  onReject?: (markdown: string) => void;
  onViewReceipt?: () => void;
}

const statusMap = {
  approved: {
    label: "Aprovado",
    icon: CheckCircle2,
    badgeClassName:
      "bg-contrast-green/10 text-main-dark-green border border-contrast-green/30",
    iconClassName: "text-contrast-green",
  },
  rejected: {
    label: "Recusado",
    icon: XCircle,
    badgeClassName:
      "bg-default-red/10 text-default-red border border-default-red/20",
    iconClassName: "text-default-red",
  },
} satisfies Record<
  "approved" | "rejected",
  {
    label: string;
    icon: typeof CheckCircle2;
    badgeClassName: string;
    iconClassName: string;
  }
>;

export default function ProfessorApproval({
  markdown,
  setMarkdown,
  userType,
  statusVersion = 0,
  onApprove,
  onReject,
  onViewReceipt,
  placeholder,
}: ProfessorApprovalProps) {
  const statusKey = useMemo(() => {
    if (userType === "PROFESSOR") return "approved" as const;
    if (userType === "GUEST") return "rejected" as const;

    return null;
  }, [userType]);

  const isStatusless = statusKey === null;
  const [isEditing, setIsEditing] = useState(() => isStatusless);
  const wasStatuslessRef = useRef(isStatusless);
  const previousStatusKeyRef = useRef<typeof statusKey>(statusKey);
  const statusVersionRef = useRef(statusVersion);

  const statusConfig = useMemo(() => {
    if (!statusKey) return null;

    return statusMap[statusKey];
  }, [statusKey]);

  useEffect(() => {
    const prevStatusKey = previousStatusKeyRef.current;
    const versionChanged = statusVersionRef.current !== statusVersion;

    if (!statusKey) {
      wasStatuslessRef.current = true;
      setIsEditing(true);
    } else if (
      wasStatuslessRef.current ||
      prevStatusKey !== statusKey ||
      versionChanged
    ) {
      wasStatuslessRef.current = false;
      setIsEditing(false);
    }

    previousStatusKeyRef.current = statusKey;
    statusVersionRef.current = statusVersion;
  }, [statusKey, statusVersion]);

  const handleApprove = () => {
    onApprove?.(markdown);
  };

  const handleReject = () => {
    onReject?.(markdown);
  };

  return (
    <div className="flex w-full max-w-xl flex-col rounded-3xl border border-dark-gray bg-white px-8 pb-8 pt-6 shadow-sm">
      <div className="min-h-[16rem]">
        {isEditing ? (
          <MarkdownTextArea
            value={markdown}
            onChange={setMarkdown}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            value={markdown}
            readOnly
            placeholder={placeholder}
            className="min-h-[14rem] resize-none rounded-2xl border border-dark-gray/60 bg-white px-4 py-5 text-base text-dark-gray shadow-none focus-visible:ring-0"
          />
        )}
      </div>

      {isEditing ? (
        <div className="mt-4 flex gap-3">
          <Button
            variant="destructive"
            className="flex-1 min-w-0 py-5 px-0 text-white"
            label="Recusar professor"
            disabled={!onReject}
            onClick={handleReject}
          />
          <Button
            className="flex-1 min-w-0 py-5 px-0 text-white"
            label="Aprovar professor"
            disabled={!onApprove}
            onClick={handleApprove}
          />
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-between gap-4">
          {statusConfig ? (
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
                statusConfig.badgeClassName
              )}
            >
              <statusConfig.icon
                className={cn("size-4", statusConfig.iconClassName)}
              />
              {statusConfig.label}
            </span>
          ) : null}

          <Button
            variant="gray"
            className="shrink-0 px-6 py-3 text-white"
            label="Editar"
            onClick={() => setIsEditing(true)}
          />
        </div>
      )}

      <Button
        variant="secondary"
        className="mt-4 w-full py-5"
        disabled={!onViewReceipt}
        label="Visualizar comprovante"
        onClick={() => onViewReceipt?.()}
      />
    </div>
  );
}
