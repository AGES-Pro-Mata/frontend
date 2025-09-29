import { useState } from "react";
import { Button } from "@/components/buttons/defaultButton";
import CanvasCard from "@/components/cards/canvasCard";
import { CalendarIcon, DollarSign, Check, Clock, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Pessoa = {
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
  status: "confirmada" | "pagamento_pendente" | "cancelada";
};

export default function ReservaCard({
  titulo,
  preco,
  tipo,
  periodo,
  imagem,
  status: initialStatus,
}: ReservaCardProps) {
  const [openModalPessoas, setOpenModalPessoas] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [status, setStatus] = useState<
    "confirmada" | "pagamento_pendente" | "cancelada"
  >(initialStatus);

  const [pessoas, setPessoas] = useState<Pessoa[]>(
    Array.from({ length: 1 }, () => ({
      nome: "",
      telefone: "",
      nascimento: "",
      cpf: "",
      genero: "",
    }))
  );

  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");

  const handleCancelarReserva = () => {
    setStatus("cancelada");
    setOpenModalCancel(false);
    toast.error("Solicitação de cancelamento enviada!");
  };

  const StatusBadge = () => {
    if (status === "confirmada") {
      return (
        <div className="flex items-center gap-2 w-[131px] h-[26px] bg-popover shadow-md rounded-full px-3">
          <div className="w-4 h-4 flex items-center justify-center rounded-full bg-contrast-green">
            <Check className="w-4 h-3 text-soft-white" />
          </div>
          <span className="text-contrast-green font-semibold text-sm">
            Confirmada
          </span>
        </div>
      );
    }
    if (status === "pagamento_pendente") {
      return (
        <div className="flex items-center gap-2 w-[180px] h-[26px] bg-popover shadow-md rounded-full px-3">
          <div className="w-4 h-4 flex items-center justify-center rounded-full bg-warning">
            <Clock className="w-4 h-3.5 text-soft-white" />
          </div>
          <span className="text-warning font-semibold text-[11px]">
            Pagamento Pendente
          </span>
        </div>
      );
    }
    if (status === "cancelada") {
      return (
        <div className="flex items-center gap-2 w-[131px] h-[26px] bg-popover shadow-md rounded-full px-3">
          <div className="w-4 h-4 flex items-center justify-center rounded-full bg-default-red">
            <X className="w-4 h-3 text-soft-white" />
          </div>
          <span className="text-default-red font-semibold text-sm">
            Cancelada
          </span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* CARD */}
      <CanvasCard className="relative w-[921px] h-[445px] mx-auto bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
        {/* Imagem */}
        <div className="relative w-[889px] h-[251px] mx-4 mt-4 rounded-t-[16px] overflow-hidden">
          <img
            src={imagem}
            alt={titulo}
            className="w-full h-full object-cover rounded-t-[16px]"
          />
        </div>

        {/* sombra */}
        <div className="absolute top-[239px] left-0 w-full h-[15px] bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

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
              <div className="flex items-center rounded-full bg-card shadow-sm gap-2 px-3 py-1">
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-soft-white">
                  <CalendarIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold text-main-dark-green whitespace-nowrap">
                  {fmt(periodo.inicio)} a {fmt(periodo.fim)}
                </span>
              </div>
              <div className="flex items-center rounded-full bg-card shadow-sm gap-2 px-3 py-1">
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
            <li>Trilha Histórico-Cultural</li>
            <li>Observação de Aves</li>
            <li>Laboratório ao Ar Livre</li>
          </ul>

          <div className="w-full mt-6 flex items-center justify-between">
            <StatusBadge />

            <div className="flex gap-3">
              {status === "confirmada" && (
                <Button
                  onClick={() => setOpenModalPessoas(true)}
                  className="bg-contrast-green text-soft-white rounded-full w-[150px] h-[40px] text-sm shadow-md hover:opacity-90"
                  label="Adicionar pessoas"
                />
              )}
              {status === "pagamento_pendente" && (
                <Button
                  onClick={() => toast.info("Comprovante enviado!")}
                  className="bg-contrast-green text-soft-white rounded-full w-[200px] h-[40px] text-sm shadow-md hover:opacity-90"
                  label="Enviar Comprovante"
                />
              )}
              <Button
                onClick={() => setOpenModalCancel(true)}
                className="bg-dark-gray text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
                label="Cancelar Reserva"
              />
            </div>
          </div>
        </div>
      </CanvasCard>

      {/* MODAL CANCELAR */}
<Dialog open={openModalCancel} onOpenChange={setOpenModalCancel}>
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

    {/* Botões empilhados */}
    <div className="flex flex-col gap-3 mt-4 w-full">
      <Button
        onClick={() => setOpenModalCancel(false)}
        className="w-full bg-card border border-gray-300 text-main-dark-green rounded-lg h-[48px] shadow-sm"
        label="Manter reserva"
      />
      <Button
        onClick={handleCancelarReserva}
        className="w-full bg-default-red text-soft-white rounded-lg h-[48px] shadow-md"
        label="Cancelar"
      />
    </div>
  </DialogContent>
</Dialog>


    </>
  );
}
