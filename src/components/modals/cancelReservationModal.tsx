import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/buttons/defaultButton";

type CancelReservationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CancelReservationModal({ open, onOpenChange, onConfirm }: CancelReservationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[499px] h-[268px] rounded-2xl bg-card flex flex-col justify-between p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main-dark-green">
            Cancelar reserva?
          </DialogTitle>
        </DialogHeader>

        <p className="text-main-dark-green text-base">
          Tem certeza de que deseja cancelar sua reserva? <br />
          Esta ação não poderá ser desfeita.
        </p>

        <div className="flex flex-col gap-3 mt-4 w-full">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full rounded-lg h-[48px] shadow-sm"
            label="Manter reserva"
          />
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="w-full rounded-lg h-[48px] shadow-md"
            label="Cancelar"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
