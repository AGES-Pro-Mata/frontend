import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/buttons/defaultButton";
import { toast } from "sonner";
import { useState } from "react";

type PaymentProofModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preco: number;
  onConfirm: (file: File) => void;
};

export function PaymentProofModal({ open, onOpenChange, preco, onConfirm }: PaymentProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("Selecione um ficheiro antes de enviar!");
      return;
    }
    onConfirm(selectedFile);
    setSelectedFile(null); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[499px] h-[400px] rounded-2xl bg-card flex flex-col justify-between p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main-dark-green">
            Enviar Comprovante
          </DialogTitle>
        </DialogHeader>

        <p className="text-main-dark-green text-sm">
          Envie o comprovante de pagamento para confirmar a reserva
        </p>

        <div className="text-sm text-main-dark-green">
          Hoje, aceitamos os seguintes comprovantes:
          <ul className="list-disc ml-6 mt-1">
            <li>TED: BANCO</li>
            <li>PIX: CHAVEPIX</li>
          </ul>
          <p className="mt-2">
            Envie o comprovante com o valor de{" "}
            <span className="font-semibold">R$ {preco.toFixed(2)}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label className="text-main-dark-green font-semibold text-sm">
            Comprovante de Pagamento
          </label>

          <div className="flex flex-col gap-1">
            <label className="relative w-full cursor-pointer">
              <span className="block w-full bg-main-dark-green text-soft-white text-center py-2 rounded-lg shadow-md">
                Escolher ficheiro
              </span>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>

            {!selectedFile && (
              <span className="text-xs text-gray-500">Nenhum ficheiro selecionado</span>
            )}
            {selectedFile && (
              <span className="text-xs text-main-dark-green">{selectedFile.name}</span>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-contrast-green text-soft-white rounded-lg h-[40px] shadow-md"
            label="Enviar Comprovante"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
