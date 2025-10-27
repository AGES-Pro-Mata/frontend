import { useState } from "react";
import { Button } from "@/components/buttons/defaultButton";
import CanvasCard from "@/components/cards/canvasCard";
import { CalendarIcon, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { ModalPessoas } from "@/components/modals/peopleModal";
import { CancelReservationModal } from "@/components/modals/cancelReservationModal";
import { PaymentProofModal } from "@/components/modals/paymentProofModal";
import { useTranslation } from "react-i18next";
import CardStatus from "@/components/cards/cardStatus";
import {
  type ReservationStatus,
  StatusEnum,
  getReservationStatusStyle,
} from "@/entities/reservation-status";

type Person = {
  nome: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  genero: string;
};

type ReservaCardProps = {
  titulo: string;
  preco: number;
  tipo?: string;
  periodo: { inicio: Date; fim: Date };
  imagem: string;
  status?: StatusReservation;
};

type StatusReservation =
  | "cadastro_pendente"
  | "pagamento_pendente"
  | "aprovacao_pendente"
  | "concluida"
  | "cancelada";

export default function ReservaCard({
  titulo,
  preco,
  tipo,
  periodo,
  imagem,
  status: initialStatus = "cadastro_pendente",
}: ReservaCardProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<StatusReservation>(initialStatus);
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
    setStatus("cancelada");
    setOpenModalCancel(false);
    toast.error(t("reservation.cancelRequestSent"));
  };
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openModalPessoas, setOpenModalPessoas] = useState(false);
  const [openModalComprovante, setOpenModalComprovante] = useState(false);
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
    setStatus("pagamento_pendente");
    toast.success(t("reservation.peopleRegisteredSuccess"));
    setOpenModalPessoas(false);
  };

  const statusMap: Record<StatusReservation, ReservationStatus> = {
    cadastro_pendente: StatusEnum.CADASTRO_PENDENTE,
    pagamento_pendente: StatusEnum.PAGAMENTO_PENDENTE,
    aprovacao_pendente: StatusEnum.AGUARDANDO_APROVACAO,
    concluida: StatusEnum.CONFIRMADA,
    cancelada: StatusEnum.CANCELADA,
  };

  const reservationStatus = statusMap[status] ?? StatusEnum.DESCONHECIDO;
  const { className: statusAccent, icon: statusIcon } =
    getReservationStatusStyle(reservationStatus);
  const statusLabel = t(`status.${reservationStatus}`);

  return (
    <>
      <CanvasCard className="relative w-[921px] h-[445px] mx-auto bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
        <div className="relative w-[889px] h-[251px] mx-4 mt-4 rounded-t-[16px] overflow-hidden">
          <img
            src={imagem}
            alt={titulo}
            className="w-full h-full object-cover rounded-t-[16px]"
          />
        </div>

        <div className="absolute top-[239px] left-0 w-full h-[15px] bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />

        <div className="flex flex-col flex-1 px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-[20px] text-main-dark-green">
              {titulo}
            </h2>
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
            <li>{t("reservation.activities.historicalTrail")}</li>
            <li>{t("reservation.activities.birdWatching")}</li>
            <li>{t("reservation.activities.outdoorLab")}</li>
          </ul>
          <div className="w-full mt-6 flex items-center justify-between">
            <CardStatus
              icon={statusIcon}
              label={statusLabel}
              accentClassName={statusAccent}
            />
            <div className="flex gap-3">
              {status === "cadastro_pendente" && (
                <Button
                  onClick={() => setOpenModalPessoas(true)}
                  className="bg-contrast-green text-soft-white rounded-full w-[150px] h-[40px] text-sm shadow-md hover:opacity-90"
                  label={t("reservation.registerPeople")}
                />
              )}
              {status === "pagamento_pendente" && (
                <Button
                  onClick={() => setOpenModalComprovante(true)}
                  className="bg-contrast-green text-soft-white rounded-full w-[200px] h-[40px] text-sm shadow-md hover:opacity-90"
                  label={t("reservation.sendPaymentProof")}
                />
              )}
              {status !== "cancelada" && (
                <Button
                  onClick={() => setOpenModalCancel(true)}
                  className="bg-dark-gray text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
                  label={t("reservation.cancelReservation")}
                />
              )}

              <Button
                onClick={() =>
                  toast.info(t("reservation.openingReservationDetails"))
                }
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
          setStatus("aprovacao_pendente");
          setOpenModalComprovante(false);
          toast.success(t("reservation.paymentProofSent"));
        }}
      />
    </>
  );
}
