/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { CalendarIcon, DollarSign } from "lucide-react";
import { appToast } from "@/components/toast/toast";
import { PeopleModal } from "@/components/modals/peopleModal";
import { CancelReservationModal } from "@/components/modals/cancelReservationModal";
import { PaymentProofModal } from "@/components/modals/paymentProofModal";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  type ReservationStatus,
  StatusEnum,
  getReservationStatusStyle,
} from "@/entities/reservation-status";
import CanvasCard from "@/components/card/canvasCard";
import CardStatus from "@/components/card/cardStatus";
import { Button } from "@/components/button/defaultButton";
import type {
  RequestEventAdminHistoryResponse,
  Reservation,
  ReservationGroupStatus,
} from "@/hooks/reservations/useMyReservations";
import { ReservationInfoCard } from "@/components/card/reservationInfoCard";
import { HistoryRequestModal } from "@/components/modals/historyRequestModal";
import { type Person } from "@/types/person";
import { useSendPaymentProof } from "@/hooks";

type MyReservationCardProps = {
  id: string;
  title: string;
  price: number;
  type?: string;
  period: { startDate: Date; endDate: Date };
  status: ReservationGroupStatus;
  reservations: Reservation[];
  history: RequestEventAdminHistoryResponse[];
  handleCancel: (id: string) => void;
  handleAddPeople: (id: string, people: Person[]) => void;
};

export default function MyReservationCard({
  id,
  title,
  price,
  type,
  period,
  status,
  reservations,
  history,
  handleCancel,
  handleAddPeople,
}: MyReservationCardProps) {
  const { t } = useTranslation();
  const [draftPeople, setDraftPeople] = useState<Person[]>([]);
  const [people, setPeople] = useState<Person[]>(
    Array.from({ length: 1 }, () => ({
      name: "",
      phone: "",
      birthDate: "",
      document: "",
      gender: "",
    })),
  );
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");
  const handleCancelReservation = () => {
    setOpenCancelModal(false);
    handleCancel(id);
  };
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openPeopleModal, setOpenPeopleModal] = useState(false);
  const [openPaymentProofModal, setOpenPaymentProofModal] = useState(false);
  const [openViewReservation, setOpenViewReservation] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const handleOpenPeopleModal = (open: boolean) => {
    if (open) {
      setDraftPeople(people.map((p) => ({ ...p })));
    }
    setOpenPeopleModal(open);
  };
  const handleSavePeople = (newPeople: Person[]) => {
    setPeople(newPeople);
    handleAddPeople(id, newPeople);
    setOpenPeopleModal(false);
  };

  const statusMap: Record<ReservationGroupStatus, ReservationStatus> = {
    PEOPLE_REQUESTED: StatusEnum.CADASTRO_PENDENTE,
    PAYMENT_REQUESTED: StatusEnum.PAGAMENTO_PENDENTE,
    CREATED: StatusEnum.AGUARDANDO_APROVACAO,
    APPROVED: StatusEnum.CONFIRMADA,
    CANCELED: StatusEnum.CANCELADA,
    CANCELED_REQUESTED: StatusEnum.CANCELAMENTO_PENDENTE,
    CANCEL_REJECTED: StatusEnum.CANCELAMENTO_REJEITADO,
    EDITED: StatusEnum.AGUARDANDO_APROVACAO,
    REJECTED: StatusEnum.CANCELADA,
    PEOPLE_SENT: StatusEnum.AGUARDANDO_APROVACAO,
    PAYMENT_SENT: StatusEnum.AGUARDANDO_APROVACAO,
    PAYMENT_APPROVED: StatusEnum.PAGAMENTO_APROVADO,
    DOCUMENT_REQUESTED: StatusEnum.AGUARDANDO_APROVACAO,
    DOCUMENT_APPROVED: StatusEnum.CONFIRMADA,
    DOCUMENT_REJECTED: StatusEnum.CANCELADA,
    PAYMENT_REJECTED: StatusEnum.PAGAMENTO_REJEITADO,
  };

  const reservationStatus = statusMap[status];

  const { className: statusAccent, icon: statusIcon } =
    getReservationStatusStyle(reservationStatus);
  const statusLabel = t(`status.${reservationStatus}`);

  const handleViewReservation = () => {
    setOpenViewReservation(true);
  };

  const handleOpenHistoryModal = () => {
    setOpenHistoryDialog(true);
  };

  const sendPaymentProofMutation: ReturnType<typeof useSendPaymentProof> = useSendPaymentProof();

  const handleSendPaymentProof = async (file: File) => {
    try {
      await sendPaymentProofMutation.mutateAsync({ reservationGroupId: id, file });
      appToast.success(t("reservation.paymentProofSent"));
    } catch (error: unknown) {
      appToast.error(t("paymentProof.sendError"));
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("PAYMENT_PROOF_SEND_ERROR");
    }
  };

  return (
    <>
      <CanvasCard className="relative w-[921px] h-[445px] mx-auto bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
        <div
          className={`relative w-[889px] h-[251px] mx-4 mt-4 rounded-t-[16px] overflow-hidden grid grid-cols-${Math.min(reservations.length, 3)} gap-1`}
        >
          {reservations.slice(0, 3).map((r) => (
            <div key={r.experience.name} className="w-full h-full overflow-hidden">
              <img
                src={r.experience.image.url}
                alt={r.experience.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>

        <div className="absolute top-[239px] left-0 w-full h-[15px] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

        <div className="flex flex-col flex-1 px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-[20px] text-main-dark-green">{title}</h2>
            {type && (
              <span className="inline-flex items-center justify-center text-xs text-main-dark-green bg-card rounded-full font-bold shadow-inner px-3 py-1 border border-main-dark-green">
                {type}
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center rounded-full bg-card-light shadow-sm gap-2 px-3 py-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-soft-white">
                  <CalendarIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-main-dark-green whitespace-nowrap">
                  {fmt(period.startDate)} {t("common.to")} {fmt(period.endDate)}
                </span>
              </div>
              <div className="flex items-center rounded-full bg-card-light shadow-sm gap-2 px-3 py-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-soft-white">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-main-dark-green whitespace-nowrap">
                  R$ {price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <ul className="text-xs font-bold text-main-dark-green/70 list-disc ml-6 mt-2 space-y-1">
            {reservations.map((r) => (
              <li key={r.experience.name}>{r.experience.name}</li>
            ))}
          </ul>

          <CardStatus
            icon={statusIcon}
            label={statusLabel}
            accentClassName={statusAccent}
            className="mt-4"
          />
          <div className="w-full mt-4 flex flex-row items-center justify-between gap-3">
            <Button
              onClick={() => handleOpenHistoryModal()}
              className="text-soft-white rounded-full flex-1 w-full h-10 text-sm shadow-md hover:opacity-70"
              variant="gray"
              label={t("reservation.history")}
            />
            {status !== "CANCELED" && status !== "CANCELED_REQUESTED" && (
              <Button
                onClick={() => setOpenCancelModal(true)}
                className="bg-default-red hover:bg-default-red text-soft-white w-full flex-1 h-10 text-sm shadow-md hover:opacity-70 rounded-full"
                label={t("reservation.cancelReservation")}
              />
            )}
            {status === "PEOPLE_REQUESTED" && (
              <Button
                onClick={() => setOpenPeopleModal(true)}
                className="bg-main-dark-green hover:bg-main-dark-green text-soft-white flex-1  rounded-full w-full h-10 text-sm shadow-md hover:opacity-70"
                label={t("reservation.registerPeople")}
              />
            )}
            {status === "PAYMENT_REQUESTED" && (
              <Button
                onClick={() => setOpenPaymentProofModal(true)}
                className="bg-main-dark-green hover:bg-main-dark-green text-soft-white flex-1  rounded-full w-full h-10 text-sm shadow-md hover:opacity-70"
                label={t("reservation.sendPaymentProof")}
              />
            )}
            <Button
              onClick={handleViewReservation}
              className="bg-main-dark-green hover:bg-main-dark-green text-soft-white flex-1  rounded-full w-full h-10 text-sm shadow-md hover:opacity-70"
              label={t("reservation.viewReservation")}
            />
          </div>
        </div>
      </CanvasCard>

      <CancelReservationModal
        open={openCancelModal}
        onOpenChange={setOpenCancelModal}
        onConfirm={handleCancelReservation}
      />
      <PeopleModal
        open={openPeopleModal}
        onOpenChange={handleOpenPeopleModal}
        draftPeople={draftPeople}
        setDraftPeople={setDraftPeople}
        people={people}
        handleSavePeople={handleSavePeople}
      />

      <HistoryRequestModal
        open={openHistoryDialog}
        onOpenChange={setOpenHistoryDialog}
        history={history}
      />

      <PaymentProofModal
        open={openPaymentProofModal}
        onOpenChange={setOpenPaymentProofModal}
        price={price}
        onConfirm={handleSendPaymentProof}
      />

      <Dialog open={openViewReservation} onOpenChange={setOpenViewReservation}>
        <DialogContent className="!max-w-none w-[90vw] h-[87vh] bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
          <ReservationInfoCard reservationId={id} className="mt-3" />
        </DialogContent>
      </Dialog>
    </>
  );
}
