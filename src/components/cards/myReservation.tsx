"use client";

import { Button } from "@/components/buttons/defaultButton";
import CanvasCard from "@/components/cards/canvasCard";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

type ReservaCardProps = {
  titulo: string;
  preco: number;
  tipo?: string;
  periodo: { inicio: Date; fim: Date };
  imagem: string;
  status: "confirmada" | "pendente" | "cancelada";
};

export default function ReservaCard({
  titulo,
  preco,
  tipo,
  periodo,
  imagem,
  status,
}: ReservaCardProps) {
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");

  const statusBadge = {
    confirmada: "bg-green-100 text-green-700 border-green-500",
    pendente: "bg-yellow-100 text-yellow-700 border-yellow-500",
    cancelada: "bg-red-100 text-red-700 border-red-500",
  }[status];

  return (
    <CanvasCard className="w-full max-w-3xl mx-auto bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* Imagem */}
      <div className="w-full overflow-hidden h-40 md:h-56 rounded-t-xl">
        <img src={imagem} alt={titulo} className="w-full h-full object-cover block" />
      </div>

      {/* Conteúdo */}
      <div className="w-full px-5 pt-4 text-main-dark-green flex flex-col gap-3 bg-[#f5f4f2]">
        {/* Header */}
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
          <h2 className="font-bold text-base w-full md:w-auto">{titulo}</h2>

          {tipo && (
            <span className="inline-flex items-center justify-center text-xs text-main-dark-green bg-card rounded-full font-bold shadow-inner px-3 py-1 shrink-0">
              {tipo}
            </span>
          )}

        {/* Rodapé */}
<div className="w-full px-2 py-2 flex items-center">
  <div className="flex items-center gap- ml-auto">
    <div className="flex items-center justify-start rounded-full bg-card shadow-sm gap-2 px-3 py-1">
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white shrink-0">
        <CalendarIcon className="w-3.5 h-3.5" />
      </div>
      <span className="text-xs md:text-sm font-semibold text-main-dark-green whitespace-nowrap">
        {fmt(periodo.inicio)} a {fmt(periodo.fim)}
      </span>
    </div>

    <div className="flex items-center justify-start rounded-full bg-card shadow-sm gap-2 h-8 px-3">
      <span className="text-xs md:text-sm font-semibold text-main-dark-green">
        R$ {preco.toFixed(2)}
      </span>
    </div>
  </div>
</div>

        </div>

        {/* Descrições */}
        <ul className="text-sm text-gray-700 list-disc ml-5">
          <li>Trilha Histórico-Cultural</li>
          <li>Observação de Aves</li>
          <li>Laboratório ao Ar Livre</li>
        </ul>

        {/* Status menor */}
        <div
          className={`inline-flex items-center px-2 py-0.5 mt-2 border text-[11px] rounded-full font-semibold ${statusBadge}`}
        >
          {status === "confirmada" && "✔ Confirmada"}
          {status === "pendente" && "⏳ Pendente"}
          {status === "cancelada" && "✖ Cancelada"}
        </div>
      </div>

      {/* Rodapé com chips à esquerda e botões à direita */}
      <div className="w-full px-5 py-3 flex items-center justify-between bg-[#f5f4f2] border-t border-gray-200">
        {/* Chips de data e preço */}
  

        {/* Botões */}
        <div className="flex gap-3">
          <Button
            onClick={() => toast.success("Pessoas adicionadas")}
            className="bg-green-600 text-white rounded-full px-4 py-1.5 text-sm shadow-md hover:bg-green-700"
            label="Adicionar pessoas"
          />
          <Button
            onClick={() => toast.info("Abrindo detalhes")}
            className="bg-gray-800 text-white rounded-full px-4 py-1.5 text-sm shadow-md hover:bg-gray-900"
            label="Visualizar Reserva"
          />
          <Button
            onClick={() => toast.error("Reserva cancelada")}
            className="bg-gray-500 text-white rounded-full px-4 py-1.5 text-sm shadow-md hover:bg-gray-600"
            label="Cancelar Reserva"
          />
        </div>
      </div>
    </CanvasCard>
  );
}
