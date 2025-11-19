import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useTranslation } from "react-i18next";
import Stepper from "./StepperModal";
import type { RequestEventAdminHistoryResponse } from "@/hooks/reservations/useMyReservations";

type HistoryRequestModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: RequestEventAdminHistoryResponse[];
};

export function HistoryRequestModal({ open, onOpenChange, history }: HistoryRequestModalProps) {
  const { t } = useTranslation();


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[55vw] h-[35%] bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-main-dark-green text-2xl font-bold">
            {t("reservation.history")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4 flex-grow overflow-y-auto">
          <div className="p-6 h-full">
            <Stepper steps={history} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
