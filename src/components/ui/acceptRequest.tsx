
import { Button } from "../buttons/defaultButton";
import { MarkdownTextArea } from "../text-area/markdownTextArea";


interface ProfessorApprovalProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  onApprove?: (markdown: string) => void;
  onReject?: (markdown: string) => void;
  onViewReceipt?: () => void;
  placeholder?: string;
}

export default function ProfessorApproval({ markdown, setMarkdown, onApprove, onReject, onViewReceipt, placeholder }: ProfessorApprovalProps) {
  return (
    <div className="flex flex-col border-2 rounded-3xl px-8 pb-8 pt-3 bg-white border-dark-gray w-full max-w-xl min-h-[30rem]">
      <div>
        <MarkdownTextArea value={markdown} onChange={setMarkdown} placeholder={placeholder} />
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 mt-2">
        <Button
          variant="destructive"
          className="flex-1 min-w-0 py-5 px-0 text-white"
          label="Recusar professor"
          onClick={() => onReject?.(markdown)}
        />
        <Button
          className="flex-1 min-w-0 py-5 px-0 text-white"
          label="Aprovar professor"
          onClick={() => onApprove?.(markdown)}
        />
      </div>

      {/* Botão desabilitado */}
      <Button
        variant="secondary"
        className="w-full mt-4 py-5"
        disabled={!onViewReceipt}
        label="Visualizar comprovante"
        onClick={() => onViewReceipt?.()}
      />
    </div>
  );
}
