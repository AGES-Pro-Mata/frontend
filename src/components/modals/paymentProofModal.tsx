import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/button/defaultButton";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type PaymentProofModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  price: number;
  onConfirm: (file: File) => Promise<void>;
};

export function PaymentProofModal({
  open,
  onOpenChange,
  price,
  onConfirm,
}: PaymentProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error(t("paymentProof.selectBeforeSend"));

      return;
    }
    setIsSubmitting(true);
    try {
      await onConfirm(selectedFile);
      setSelectedFile(null);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Limpa o arquivo selecionado ao fechar
        if (!isOpen) {
          setSelectedFile(null);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="w-[499px] h-[400px] rounded-2xl bg-white flex flex-col justify-between p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main-dark-green">
            {t("reservation.sendPaymentProof")}
          </DialogTitle>
        </DialogHeader>

        <p className="text-main-dark-green text-sm">{t("paymentProof.instructions")}</p>

        <div className="text-sm text-main-dark-green">
          {t("paymentProof.acceptedProofs")}
          <ul className="list-disc ml-6 mt-1">
            <li>{t("paymentProof.ted")}</li>
            <li>{t("paymentProof.pix")}</li>
          </ul>
          <p className="mt-2">
            {t("paymentProof.sendProofWithValue")}{" "}
            <span className="font-semibold">R$ {price.toFixed(2)}</span>
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <label className="text-main-dark-green font-semibold text-sm">
            {t("paymentProof.paymentProofLabel")}
          </label>

          <div className="flex flex-col gap-1">
            <label className="relative w-full cursor-pointer">
              <span className="block w-full bg-main-dark-green text-soft-white text-center py-2 rounded-lg shadow-md">
                {t("paymentProof.chooseFile")}
              </span>
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept="image/*,application/pdf"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>

            {!selectedFile && (
              <span className="text-xs text-gray-500">{t("paymentProof.noFileSelected")}</span>
            )}
            {selectedFile && (
              <span className="text-xs text-main-dark-green">{selectedFile.name}</span>
            )}
          </div>

          <Button
            onClick={() => {
              void handleSubmit().catch(() => undefined);
            }}
            disabled={!selectedFile || isSubmitting}
            className="w-full bg-contrast-green text-soft-white rounded-lg h-[40px] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isSubmitting}
            label={t("reservation.sendPaymentProof")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}