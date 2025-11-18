import { useState } from "react";
import { CalendarIcon, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { ModalPessoas } from "@/components/modals/peopleModal";
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
import type { Reservation, ReservationGroupStatus } from "@/hooks/reservations/useMyReservations";
import { ReservationInfoCard } from "@/components/card/reservationInfoCard";

export type Person = {
  nome: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  genero: string;
};

type ReservaCardProps = {
  id: string;
  titulo: string;
  preco: number;
  tipo?: string;
  periodo: { inicio: Date; fim: Date };
  status: ReservationGroupStatus;
  reservations: Reservation[];
  handleCancel: (id: string) => void;
  handleAddPeople: (id: string, people: Person[]) => void;
};

export default function ReservaCard({
  id,
  titulo,
  preco,
  tipo,
  periodo,
  status,
  reservations,
  handleCancel,
  handleAddPeople,
}: ReservaCardProps) {
  const { t } = useTranslation();
  const [draftPessoas, setDraftPessoas] = useState<Person[]>([]);
  const [pessoas, setPessoas] = useState<Person[]>(
    Array.from({ length: 1 }, () => ({
      nome: "",
      telefone: "",
      nascimento: "",
      cpf: "",
      genero: "",
    })),
  );
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");
  const handleCancelarReserva = () => {
    setOpenModalCancel(false);
    handleCancel(id);
  };
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalPessoas, setOpenModalPessoas] = useState(false);
  const [openModalComprovante, setOpenModalComprovante] = useState(false);
  const [openViewReservation, setOpenViewReservation] = useState(false);
  const handleOpenModalPessoas = (open: boolean) => {
    if (open) {
      setDraftPessoas(pessoas.map((p) => ({ ...p })));
    } else {
      setDraftPessoas(pessoas.map((p) => ({ ...p })));
    }
    setOpenModalPessoas(open);
  };
  const handleSalvarPessoas = (novasPessoas: Person[]) => {
    setPessoas(novasPessoas);
    handleAddPeople(id, novasPessoas);
    setOpenModalPessoas(false);
  };

  const statusMap: Record<ReservationGroupStatus, ReservationStatus> = {
    PEOPLE_REQUESTED: StatusEnum.CADASTRO_PENDENTE,
    PAYMENT_REQUESTED: StatusEnum.PAGAMENTO_PENDENTE,
    CREATED: StatusEnum.AGUARDANDO_APROVACAO,
    APPROVED: StatusEnum.CONFIRMADA,
    CANCELED: StatusEnum.CANCELADA,
    CANCELED_REQUESTED: StatusEnum.CANCELAMENTO_PENDENTE,
    EDITED: StatusEnum.DESCONHECIDO,
    REJECTED: StatusEnum.DESCONHECIDO,
    PEOPLE_SENT: StatusEnum.DESCONHECIDO,
    PAYMENT_SENT: StatusEnum.DESCONHECIDO,
    DOCUMENT_REQUESTED: StatusEnum.DESCONHECIDO,
    DOCUMENT_APPROVED: StatusEnum.DESCONHECIDO,
    DOCUMENT_REJECTED: StatusEnum.DESCONHECIDO,
  };

  const reservationStatus = statusMap[status];

  const { className: statusAccent, icon: statusIcon } =
    getReservationStatusStyle(reservationStatus);
  const statusLabel = t(`status.${reservationStatus}`);

  const handleViewReservation = () => {
    setOpenViewReservation(true);
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
            <h2 className="font-bold text-[20px] text-main-dark-green">{titulo}</h2>
            {tipo && (
              <span className="inline-flex items-center justify-center text-xs text-main-dark-green bg-card rounded-full font-bold shadow-inner px-3 py-1 border border-main-dark-green">
                {tipo}
              </span>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <div className="flex items-center rounded-full bg-card-light shadow-sm gap-2 px-3 py-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-soft-white">
                  <CalendarIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-main-dark-green whitespace-nowrap">
                  {fmt(periodo.inicio)} a {fmt(periodo.fim)}
                </span>
              </div>
              <div className="flex items-center rounded-full bg-card-light shadow-sm gap-2 px-3 py-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-soft-white">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-main-dark-green whitespace-nowrap">
                  R$ {preco.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <ul className="text-xs font-bold text-main-dark-green/70 list-disc ml-6 mt-2 space-y-1">
            {reservations.map((r) => (
              <li key={r.experience.name}>{r.experience.name}</li>
            ))}
          </ul>
          <div className="w-full mt-6 flex items-center justify-between">
            <CardStatus icon={statusIcon} label={statusLabel} accentClassName={statusAccent} />
            <div className="flex gap-3">
              {status === "PEOPLE_REQUESTED" && (
                <Button
                  onClick={() => setOpenModalPessoas(true)}
                  className="bg-contrast-green text-soft-white rounded-full w-[150px] h-[40px] text-sm shadow-md hover:opacity-90"
                  label={t("reservation.registerPeople")}
                />
              )}
              {status === "PAYMENT_REQUESTED" && (
                <Button
                  onClick={() => setOpenModalComprovante(true)}
                  className="bg-contrast-green text-soft-white rounded-full w-[200px] h-[40px] text-sm shadow-md hover:opacity-90"
                  label={t("reservation.sendPaymentProof")}
                />
              )}
              {status !== "CANCELED" && status !== "CANCELED_REQUESTED" && (
                <Button
                  onClick={() => setOpenModalCancel(true)}
                  className="bg-dark-gray text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
                  label={t("reservation.cancelReservation")}
                />
              )}

              <Button
                onClick={handleViewReservation}
                className="bg-main-dark-green text-soft-white rounded-full w-[200px] h-[40px] text-sm shadow-md hover:opacity-90"
                label={t("reservation.viewReservation")}
              />
            </div>
          </div>
        </div>
      </CanvasCard>

      <CancelReservationModal
        open={openModalCancel}
        onOpenChange={setOpenModalCancel}
        onConfirm={handleCancelarReserva}
      />
      <ModalPessoas
        open={openModalPessoas}
        onOpenChange={handleOpenModalPessoas}
        draftPessoas={draftPessoas}
        setDraftPessoas={setDraftPessoas}
        pessoas={pessoas}
        handleSalvarPessoas={handleSalvarPessoas}
      />

      <PaymentProofModal
        open={openModalComprovante}
        onOpenChange={setOpenModalComprovante}
        preco={preco}
        onConfirm={() => {
          setOpenModalComprovante(false);
          toast.success(t("reservation.paymentProofSent"));
        }}
      />

      <Dialog open={openViewReservation} onOpenChange={setOpenViewReservation}>
        <DialogContent className="!max-w-none w-[90vw] h-[87vh] bg-white rounded-xl shadow-lg p-6 overflow-y-auto">
          <ReservationInfoCard reservationId={id} className="mt-3"/>
        </DialogContent>
      </Dialog>
    </>
  );
}
