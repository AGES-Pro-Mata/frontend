import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/button/defaultButton';

type CancelReservationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export function CancelReservationModal({
  open,
  onOpenChange,
  onConfirm,
}: CancelReservationModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[499px] h-[268px] rounded-2xl bg-soft-white flex flex-col justify-between p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-main-dark-green">
            {t('cancelReservation.title')}
          </DialogTitle>
        </DialogHeader>

        <p className="text-main-dark-green text-base">{t('cancelReservation.confirmation')}</p>

        <div className="flex flex-col gap-3 mt-4 w-full">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="w-full rounded-lg h-[48px] shadow-sm"
            label={t('cancelReservation.keepReservation')}
          />
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="w-full rounded-lg h-[48px] shadow-md"
            label={t('common.cancel')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
