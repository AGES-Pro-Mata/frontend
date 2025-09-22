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
  const [menNames, setMenNames] = useState("")
  const [womenNames, setWomenNames] = useState("")
  const [saved, setSaved] = useState(false)

  const fmt = (d: Date) => d.toLocaleDateString("pt-BR")

  const validateNames = () => {
    const menCount = menNames.trim() ? menNames.trim().split("\n").length : 0
    const womenCount = womenNames.trim() ? womenNames.trim().split("\n").length : 0
    if (men !== menCount) return false
    if (women !== womenCount) return false
    return true
  }

  const handleSave = () => {
    if (range?.from && range?.to && validateNames()) {
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
      <div className="w-[959px] h-[277px] mx-auto mt-2 rounded-md overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="w-full h-[85px] flex flex-col justify-between px-6 py-2 text-main-dark-green">
        <div className="flex items-center gap-4">
          <h2 className="font-bold">{title}</h2>
          <span
            className="w-[59px] h-[20px] flex items-center justify-center text-xs text-main-dark-green bg-card rounded-full font-bold shadow-inner"
          >
            Pacote
          </span>
          <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-[26px] px-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white">
              <span className="text-[14px] font-bold">$</span>
            </div>
            <span className="text-[14px] font-bold text-main-dark-green">
              R$ {price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-[26px] px-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white">
              <CalendarIcon size={14} />
            </div>
            <span className="text-[14px] font-bold text-main-dark-green">
              {savedRange?.from && savedRange?.to
                ? `${fmt(savedRange.from)} a ${fmt(savedRange.to)}`
                : `${fmt(period.start)} a ${fmt(period.end)}`}
            </span>
          </div>
        </div>
        <div className="flex justify-end mt-1">
          <Button
            onClick={() => setOpen(true)}
            className="bg-main-dark-green text-white rounded-full px-8 py-2 shadow-md hover:bg-contrast-green"
          >
            {saved ? "Editar informações" : "Selecionar data e número de pessoas"}
          </Button>
        </div>
      </div>
      {open && (
        <div className="p-6 bg-banner rounded-lg shadow-md flex flex-col gap-6 text-main-dark-green mx-4 my-4">
          <h3 className="text-lg font-bold">Escolha de Data</h3>

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

          <div className="grid grid-cols-2 gap-6">
            <div className="flex justify-center">
              <div className="bg-soft-white rounded-lg shadow-sm p-4">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(value: DateRange | undefined) =>
                    setRange(value ?? { from: undefined, to: undefined })
                  }
                  defaultMonth={range.from}
                  classNames={{
                    day_selected: "bg-main-dark-green text-white",
                    day_range_start: "bg-main-dark-green text-white rounded-l-full",
                    day_range_end: "bg-main-dark-green text-white rounded-r-full",
                    day_range_middle: "bg-contrast-green text-white",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Label>Número de pessoas do gênero masculino</Label>
                <Input
                  inputMode="numeric"
                  pattern="\d*"
                  value={men}
                  onChange={(e) => handleNumberInput(e, setMen)}
                  className="border border-main-dark-green rounded-md"
                />
              </div>

              <div>
                <Label>Número de pessoas do gênero feminino</Label>
                <Input
                  inputMode="numeric"
                  pattern="\d*"
                  value={women}
                  onChange={(e) => handleNumberInput(e, setWomen)}
                  className="border border-main-dark-green rounded-md"
                />
              </div>

              <div>
                <Label>Nomes dos participantes masculinos</Label>
                <textarea
                  className="w-full mt-2 p-2 border border-main-dark-green rounded-md h-16 resize-none"
                  placeholder="Um nome por linha"
                  value={menNames}
                  onChange={(e) => setMenNames(e.target.value)}
                />
              </div>

              <div>
                <Label>Nomes dos participantes femininos</Label>
                <textarea
                  className="w-full mt-2 p-2 border border-main-dark-green rounded-md h-16 resize-none"
                  placeholder="Um nome por linha"
                  value={womenNames}
                  onChange={(e) => setWomenNames(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              className="mt-3 bg-main-dark-green text-white rounded-full px-8 py-2 shadow-md hover:bg-contrast-green"
              onClick={handleSave}
              disabled={!range?.from || !range?.to || !validateNames()}
            >
              Salvar
            </Button>
          </div>
        </div>
      )}
    </CanvasCard>
  )
}
