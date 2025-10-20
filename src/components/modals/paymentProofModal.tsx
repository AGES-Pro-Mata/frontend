import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/buttons/defaultButton";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useState } from "react";

type PaymentProofModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preco: number;
  onConfirm: (file: File) => void;
};

export function PaymentProofModal({ open, onOpenChange, preco, onConfirm }: PaymentProofModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error(t("paymentProof.selectBeforeSend"));
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
            {t("reservation.sendPaymentProof")}
          </DialogTitle>
        </DialogHeader>

        <p className="text-main-dark-green text-sm">
          {t("paymentProof.instructions")}
        </p>

        <div className="text-sm text-main-dark-green">
          {t("paymentProof.acceptedProofs")}
          <ul className="list-disc ml-6 mt-1">
            <li>{t("paymentProof.ted")}</li>
            <li>{t("paymentProof.pix")}</li>
          </ul>
          <p className="mt-2">
            {t("paymentProof.sendProofWithValue")}{" "}
            <span className="font-semibold">R$ {preco.toFixed(2)}</span>
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
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>

            {!selectedFile && (
              <span className="text-xs text-gray-500">
                {t("paymentProof.noFileSelected")}
              </span>
            )}
            {selectedFile && (
              <span className="text-xs text-main-dark-green">{selectedFile.name}</span>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-contrast-green text-soft-white rounded-lg h-[40px] shadow-md"
            label={t("reservation.sendPaymentProof")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
