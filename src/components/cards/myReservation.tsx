import { useState } from "react";
import { Button } from "@/components/buttons/defaultButton";
import CanvasCard from "@/components/cards/canvasCard";
import { CalendarIcon, DollarSign, Check, Clock, X, Plus } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  status,
}: ReservaCardProps) {
  const [openModal, setOpenModal] = useState(false);
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

  const handleChange = (index: number, field: keyof Pessoa, value: string) => {
    const updated = [...pessoas];
    updated[index][field] = value;
    setPessoas(updated);
  };

  const handleAddPessoa = () => {
    setPessoas([...pessoas, { nome: "", telefone: "", nascimento: "", cpf: "", genero: "" }]);
  };

  const handleSalvar = () => {
    for (let i = 0; i < pessoas.length; i++) {
      const p = pessoas[i];
      if (!p.nome || !p.telefone || !p.nascimento || !p.cpf || !p.genero) {
        toast.error(`Preencha todos os campos da pessoa ${i + 1}`);
        return;
      }
    }
    toast.success("Pessoas cadastradas com sucesso!");
    setOpenModal(false);
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

{/* Faixa de sombra cobrindo toda a largura do card */}
<div className="absolute top-[239px] left-0 w-full h-[15px] bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />










        <div className="flex flex-col flex-1 px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="font-bold text-[20px] text-main-dark-green">{titulo}</h2>
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

  {status === "confirmada" && (
    <div className="flex gap-3">
      <Button
        onClick={() => setOpenModal(true)}
        className="bg-contrast-green text-soft-white rounded-full w-[150px] h-[40px] text-sm shadow-md hover:opacity-90"
        label="Adicionar pessoas"
      />
      <Button
        onClick={() => toast.info("Abrindo detalhes")}
        className="bg-main-dark-green text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
        label="Visualizar Reserva"
      />
      <Button
        onClick={() => toast.error("Reserva cancelada")}
        className="bg-dark-gray text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
        label="Cancelar Reserva"
      />
    </div>
  )}

  {status === "pagamento_pendente" && (
    <div className="flex gap-3">
      <Button
        onClick={() => toast.info("Comprovante enviado!")}
        className="bg-contrast-green text-soft-white rounded-full w-[200px] h-[40px] text-sm shadow-md hover:opacity-90"
        label="Enviar Comprovante"
      />
      <Button
        onClick={() => toast.info("Abrindo detalhes")}
        className="bg-main-dark-green text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
        label="Visualizar Reserva"
      />
      <Button
        onClick={() => toast.error("Reserva cancelada")}
        className="bg-dark-gray text-soft-white w-[150px] h-[40px] text-sm shadow-md hover:opacity-90 rounded-full"
        label="Cancelar Reserva"
      />
    </div>
  )}
</div>

        </div>
      </CanvasCard>

      {/* MODAL GRANDE */}
     <Dialog open={openModal} onOpenChange={setOpenModal}>
  <DialogContent
  className="
    !max-w-none
    w-[90vw]
    h-[75vh]
    bg-card 
    rounded-xl 
    shadow-lg 
    p-6 
    flex flex-col
  "
>
  <DialogHeader>
    <DialogTitle className="text-main-dark-green text-2xl font-bold">
      Cadastrar Pessoas
    </DialogTitle>
  </DialogHeader>

  {/* wrapper sem flex-1 nem margin exagerada */}
  <div className="mt-2 flex flex-col gap-4 flex-grow">
    <div
      className={`${
        pessoas.length > 1 ? "max-h-[45vh] overflow-y-auto pr-2" : ""
      }`}
    >
      <div className="grid grid-cols-1 gap-4">
        {pessoas.map((pessoa, index) => (
          <div
            key={index}
            className="col-span-5 grid grid-cols-5 gap-4 border-b border-gray-300 pb-4"
          >
            <Input
              placeholder="Nome"
              value={pessoa.nome}
              onChange={(e) => handleChange(index, "nome", e.target.value)}
              className="col-span-1"
            />
            <Input
              placeholder="Telefone"
              value={pessoa.telefone}
              onChange={(e) => handleChange(index, "telefone", e.target.value)}
              className="col-span-1"
            />
            <Input
              type="date"
              value={pessoa.nascimento}
              onChange={(e) => handleChange(index, "nascimento", e.target.value)}
              className="col-span-1"
            />
            <Input
              placeholder="CPF"
              value={pessoa.cpf}
              onChange={(e) => handleChange(index, "cpf", e.target.value)}
              className="col-span-1"
            />
            <Select
              onValueChange={(v) => handleChange(index, "genero", v)}
              value={pessoa.genero}
            >
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="Selecione o gênero" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>

    {/* Botão adicionar pessoa */}
    <div>
      <Button
        onClick={handleAddPessoa}
        className="bg-main-dark-green text-soft-white rounded-full w-[240px] h-[40px] text-sm shadow-md hover:opacity-90 flex items-center gap-2"
        label="Adicionar mais pessoa"
      />
    </div>

    {/* Rodapé */}
    <DialogFooter className="flex justify-between mt-4">
      <Button
        onClick={() => setOpenModal(false)}
        className="bg-dark-gray text-soft-white rounded-full w-[120px] h-[40px]"
        label="Voltar"
      />
      <Button
        onClick={handleSalvar}
        className="bg-contrast-green text-soft-white rounded-full w-[120px] h-[40px]"
        label="Salvar"
      />
    </DialogFooter>
  </div>
</DialogContent>

</Dialog>



    </>
  );
}
