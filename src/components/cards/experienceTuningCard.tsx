"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CanvasCard from "@/components/cards/canvasCard"
import { CalendarIcon } from "lucide-react"

type DateRange = {
  from?: Date
  to?: Date
}

type ExperienceCardProps = {
  title: string
  price: number
  period: { start: Date; end: Date } 
  imageUrl: string
}

export default function ExperienceCard({
  title,
  price,
  period,
  imageUrl,
}: ExperienceCardProps) {
  const [open, setOpen] = useState(false)
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined })
  const [savedRange, setSavedRange] = useState<DateRange | undefined>()
  const [men, setMen] = useState(0)
  const [women, setWomen] = useState(0)
  const [saved, setSaved] = useState(false)

  const fmt = (d: Date) => d.toLocaleDateString("pt-BR")

  const handleSave = () => {
    if (range?.from && range?.to) {
      setSavedRange(range)
      setSaved(true)
      setOpen(false)
    }
  }

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: number) => void
  ) => {
    const value = e.target.value.replace(",", "")
    const num = Number(value)
    if (!isNaN(num) && num >= 0) {
      setter(num)
    } else if (value === "") {
      setter(0)
    }
  }

  return (
    <CanvasCard className="w-[985px] min-h-[352px] bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* imagem */}
      <div className="w-[959px] h-[277px] mx-auto mt-2 rounded-md overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* rodapé */}
<div className="w-full px-6 py-2 text-main-dark-green flex flex-col gap-2">
  {/* linha 1: info principal */}
  <div className="flex items-center gap-4">
    <h2 className="font-bold">{title}</h2>

    {/* pacote */}
    <span
      className="w-[59px] h-[20px] flex items-center justify-center text-xs text-main-dark-green bg-card rounded-full font-bold shadow-inner"
    >
      Pacote
    </span>

    {/* preço */}
    <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-[26px] px-3">
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white">
        <span className="text-[14px] font-bold">$</span>
      </div>
      <span className="text-[14px] font-bold text-main-dark-green">
        R$ {price.toFixed(2)}
      </span>
    </div>

    {/* período mockado */}
    <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-[26px] px-3">
      <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white">
        <CalendarIcon size={14} />
      </div>
      <span className="text-[14px] font-bold text-main-dark-green">
        {`${fmt(period.start)} a ${fmt(period.end)}`}
      </span>
    </div>
  </div>

  {/* linha 2: botão à direita */}
  <div className="flex justify-end">
    <Button
      onClick={() => setOpen(true)}
      className="bg-main-dark-green text-white rounded-full px-8 py-2 shadow-md hover:bg-main-dark-green"
    >
      {saved ? "Editar informações" : "Selecionar data e número de pessoas"}
    </Button>
  </div>

  {/* linha 3: dados escolhidos à esquerda */}
{saved && savedRange?.from && savedRange?.to && (
  <div className="flex justify-start gap-6">
    <span className="text-sm text-main-dark-green">
      Homens: <span className="font-bold">{men}</span>
    </span>
    <span className="text-sm text-main-dark-green">
      Mulheres: <span className="font-bold">{women}</span>
    </span>
    <span className="text-sm text-main-dark-green">
      Data selecionada:{" "}
      <span className="font-bold">
        {`${fmt(savedRange.from)} a ${fmt(savedRange.to)}`}
      </span>
    </span>
  </div>
)}

</div>


      {/* modal de seleção */}
      {open && (
        <div className="p-6 bg-banner rounded-lg shadow-md flex flex-col gap-6 text-main-dark-green mx-4 my-4">
          <h3 className="text-lg font-bold">Escolha de Data</h3>

          {/* período selecionado */}
          <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-[26px] px-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white">
              <CalendarIcon size={14} />
            </div>
            <span className="text-[14px] font-bold text-main-dark-green">
              {range?.from && range?.to
                ? `${fmt(range.from)} a ${fmt(range.to)}`
                : "Selecione o período no calendário"}
            </span>
          </div>

          {/* calendário e inputs */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex justify-center">
              <div className="bg-soft-white rounded-lg shadow-sm p-4">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(value: DateRange | undefined) =>
                    setRange(value ?? { from: undefined, to: undefined })
                  }
                  defaultMonth={range.from ?? period.start}
                  disabled={[
                    { before: period.start }, 
                    { after: period.end },  
                  ]}
                  classNames={{
                    day_selected: "bg-main-dark-green text-white",
                    day_range_start: "bg-main-dark-green text-white rounded-l-full",
                    day_range_end: "bg-main-dark-green text-white rounded-r-full",
                    day_range_middle: "bg-contrast-green text-white",
                    day_disabled: "text-gray-400 opacity-50 cursor-not-allowed", 
                  }}
                />
              </div>
            </div>
            {/* inputs centralizados */}
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <div className="w-3/4">
                <Label className="mb-2 block">Número de pessoas do gênero masculino</Label>
                <Input
                  inputMode="numeric"
                  pattern="\d*"
                  value={men}
                  onChange={(e) => handleNumberInput(e, setMen)}
                  className="border border-main-dark-green rounded-md w-full"
                />
              </div>
              <div className="w-3/4">
                <Label className="mb-2 block">Número de pessoas do gênero feminino</Label>
                <Input
                  inputMode="numeric"
                  pattern="\d*"
                  value={women}
                  onChange={(e) => handleNumberInput(e, setWomen)}
                  className="border border-main-dark-green rounded-md w-full"
                />
              </div>
            </div>
          </div>
          {/* salvar */}
          <div className="flex justify-end">
            <Button
              className="mt-3 bg-main-dark-green text-white rounded-full px-8 py-2 shadow-md hover:bg-contrast-green"
              onClick={handleSave}
              disabled={!range?.from || !range?.to}
            >
              Salvar
            </Button>
          </div>
        </div>
      )}
    </CanvasCard>
  )
}
