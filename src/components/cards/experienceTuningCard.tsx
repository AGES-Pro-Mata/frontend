"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CanvasCard from "@/components/cards/canvasCard"

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
  const [date, setDate] = useState<Date | undefined>()
  const [men, setMen] = useState(0)
  const [women, setWomen] = useState(0)
  const [others, setOthers] = useState(0)

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setOpen(false)
  }

  return (
    <CanvasCard className="overflow-hidden">
      {/* Imagem da experiência */}
      <div className="h-56 w-full overflow-hidden">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* Infos principais */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="rounded-md bg-muted px-2 py-1 text-xs">Pacote</span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <span> R$ {price.toFixed(2)}</span>
          <span> {period.start.toLocaleDateString()} a {period.end.toLocaleDateString()}</span>
        </div>

        {/* Exibe dados salvos */}
        {saved && (
          <div className="text-sm text-muted-foreground space-x-4">
            <span>Homens: {men}</span>
            <span>Mulheres: {women}</span>
            <span>Outros: {others}</span>
            <span>Data selecionada: {date?.toLocaleDateString()}</span>
          </div>
        )}

        {/* Botão abre popover/modal */}
        <Button variant="secondary" onClick={() => setOpen(true)}>
          {saved ? "Editar informações" : "Selecionar data e número de pessoas"}
        </Button>
      </div>

      {/* Popover com form */}
      {open && (
        <div className="p-4 border-t bg-card/40 flex flex-col gap-3 ">
          <Label>Escolha uma data</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            fromDate={period.start}
            toDate={period.end}
          />

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Homens</Label>
              <Input type="number" value={men} onChange={e => setMen(Number(e.target.value))} />
            </div>
            <div>
              <Label>Mulheres</Label>
              <Input type="number" value={women} onChange={e => setWomen(Number(e.target.value))} />
            </div>
            <div>
              <Label>Outros</Label>
              <Input type="number" value={others} onChange={e => setOthers(Number(e.target.value))} />
            </div>
          </div>

          <Button className="mt-3" onClick={handleSave}>Salvar</Button>
        </div>
      )}
    </CanvasCard>
  )
}
