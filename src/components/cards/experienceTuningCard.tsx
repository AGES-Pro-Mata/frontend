// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import CanvasCard from "@/components/cards/canvasCard"
// import { CalendarIcon } from "lucide-react"

// type ExperienceCardProps = {
//   title: string
//   price: number
//   period: { start: Date; end: Date }
//   imageUrl: string
// }

// export default function ExperienceCard({
//   title,
//   price,
//   period,
//   imageUrl,
// }: ExperienceCardProps) {
//   const [open, setOpen] = useState(false)
//   const [date, setDate] = useState<Date | undefined>()
//   const [men, setMen] = useState(0)
//   const [women, setWomen] = useState(0)
//   const [others, setOthers] = useState(0)

//   const [saved, setSaved] = useState(false)

//   const handleSave = () => {
//     setSaved(true)
//     setOpen(false)
//   }

//   return (
//     <CanvasCard className="w-[985px] min-h-[352px] bg-[#E7DED4] shadow-lg rounded-xl overflow-hidden flex flex-col">
//       {/* Imagem */}
//       <div className="w-[959px] h-[277px] mx-auto mt-2 rounded-md overflow-hidden">
//         <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
//       </div>

//       {/* Rodapé */}
//       <div className="w-full h-[85px] flex flex-col justify-between px-6 py-2 text-[#2E361D]">
//         <div className="flex items-center gap-4">
//           <h2 className="font-bold">{title}</h2>
//           <span
//             className="w-[59px] h-[20px] flex items-center justify-center text-xs text-[#2E361D] bg-[#E7DED4] rounded-full font-bold"
//             style={{ boxShadow: "inset 0 0 4px rgba(0,0,0,0.25)" }}
//           >
//             Pacote
//           </span>

//           {/* Preço */}
//           <div className="flex items-center justify-start rounded-full bg-[#E7DED4] shadow-md gap-2 h-[26px] px-3">
//             <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2E361D] text-white">
//               <span className="text-[14px] font-bold">$</span>
//             </div>
//             <span className="text-[14px] font-bold text-[#2E361D]">
//               R$ {price.toFixed(2)}
//             </span>
//           </div>

//           {/* Datas */}
//           <div className="flex items-center justify-start rounded-full bg-[#E7DED4] shadow-md gap-2 h-[26px] px-3">
//             <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2E361D] text-white">
//               <CalendarIcon size={14} />
//             </div>
//             <span className="text-[14px] font-bold text-[#2E361D]">
//               {period.start.toLocaleDateString()} a {period.end.toLocaleDateString()}
//             </span>
//           </div>
//         </div>

//         {/* Botão abrir modal */}
//         <div className="flex justify-end mt-1">
//           <Button
//             onClick={() => setOpen(true)}
//             className="bg-[#2E361D] text-white rounded-full px-8 py-2 shadow-md hover:bg-[#232918]"
//           >
//             {saved ? "Editar informações" : "Selecionar data e número de pessoas"}
//           </Button>
//         </div>
//       </div>

//       {/* Parte expansível */}
//       {open && (
//         <div className="p-6 bg-[#D1C3B2] rounded-lg shadow-md flex flex-col gap-6 text-[#2E361D] mx-4 my-4">
//           <h3 className="text-lg font-bold">Escolha de Data</h3>

//           <div className="grid grid-cols-2 gap-6">
//             {/* Coluna calendário */}
//             <div className="flex justify-center">
//               <div className="bg-white rounded-lg shadow-sm p-4">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   onSelect={setDate}
//                   fromDate={period.start}
//                   toDate={period.end}
//                 />
//               </div>
//             </div>

//             {/* Coluna inputs */}
//             <div className="flex flex-col gap-4">
//               <div>
//                 <Label className="text-sm font-medium">
//                   Número de pessoas do gênero masculino
//                 </Label>
//                 <Input
//                   type="number"
//                   value={men}
//                   onChange={(e) => setMen(Number(e.target.value))}
//                   className="border border-[#2E361D] rounded-md"
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">
//                   Número de pessoas do gênero feminino
//                 </Label>
//                 <Input
//                   type="number"
//                   value={women}
//                   onChange={(e) => setWomen(Number(e.target.value))}
//                   className="border border-[#2E361D] rounded-md"
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">
//                   Nomes dos participantes masculinos
//                 </Label>
//                 <textarea
//                   className="w-full mt-2 p-2 border border-[#2E361D] rounded-md h-16 resize-none 
//                              focus:outline-none focus:ring-0 focus:border-[#2E361D]"
//                   placeholder="Digite os nomes aqui, separados por quebra de linha"
//                 />
//               </div>

//               <div>
//                 <Label className="text-sm font-medium">
//                   Nomes dos participantes femininos
//                 </Label>
//                 <textarea
//                   className="w-full mt-2 p-2 border border-[#2E361D] rounded-md h-16 resize-none 
//                              focus:outline-none focus:ring-0 focus:border-[#2E361D]"
//                   placeholder="Digite os nomes aqui, separados por quebra de linha"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Botão salvar */}
//           <div className="flex justify-end">
//             <Button
//               className="mt-3 bg-[#2E361D] text-white rounded-full px-8 py-2 shadow-md hover:bg-[#232918]"
//               onClick={handleSave}
//             >
//               Salvar
//             </Button>
//           </div>
//         </div>
//       )}
//     </CanvasCard>
//   )
// }
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

  // Seleção atual no calendário (início/fim)
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined })

  // Intervalo salvo que aparece no rodapé
  const [savedRange, setSavedRange] = useState<DateRange | undefined>()

  const [men, setMen] = useState(0)
  const [women, setWomen] = useState(0)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (range?.from && range?.to) {
      setSavedRange(range)
      setSaved(true)
      setOpen(false)
    }
  }

  const fmt = (d: Date) => d.toLocaleDateString("pt-BR")

  return (
    <CanvasCard className="w-[985px] min-h-[352px] bg-[#E7DED4] shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* Imagem */}
      <div className="w-[959px] h-[277px] mx-auto mt-2 rounded-md overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      {/* Rodapé */}
      <div className="w-full h-[85px] flex flex-col justify-between px-6 py-2 text-[#2E361D]">
        <div className="flex items-center gap-4">
          <h2 className="font-bold">{title}</h2>

          {/* Badge Pacote (sem borda, sombra interna) */}
          <span
            className="w-[59px] h-[20px] flex items-center justify-center text-xs text-[#2E361D] bg-[#E7DED4] rounded-full font-bold"
            style={{ boxShadow: "inset 0 0 4px rgba(0,0,0,0.25)" }}
          >
            Pacote
          </span>

          {/* Preço */}
          <div className="flex items-center justify-start rounded-full bg-[#E7DED4] shadow-md gap-2 h-[26px] px-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2E361D] text-white">
              <span className="text-[14px] font-bold">$</span>
            </div>
            <span className="text-[14px] font-bold text-[#2E361D]">
              R$ {price.toFixed(2)}
            </span>
          </div>

          {/* Datas (mostra o intervalo salvo; se não houver, mostra o período padrão) */}
          <div className="flex items-center justify-start rounded-full bg-[#E7DED4] shadow-md gap-2 h-[26px] px-3">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-[#2E361D] text-white">
              <CalendarIcon size={14} />
            </div>
            <span className="text-[14px] font-bold text-[#2E361D]">
              {savedRange?.from && savedRange?.to
                ? `${fmt(savedRange.from)} a ${fmt(savedRange.to)}`
                : `${fmt(period.start)} a ${fmt(period.end)}`}
            </span>
          </div>
        </div>

        {/* Botão abrir painel */}
        <div className="flex justify-end mt-1">
          <Button
            onClick={() => setOpen(true)}
            className="bg-[#2E361D] text-white rounded-full px-8 py-2 shadow-md hover:bg-[#232918]"
          >
            {saved ? "Editar informações" : "Selecionar data e número de pessoas"}
          </Button>
        </div>
      </div>

      {/* Parte expansível */}
      {open && (
        <div className="p-6 bg-[#D1C3B2] rounded-lg shadow-md flex flex-col gap-6 text-[#2E361D] mx-4 my-4">
          <h3 className="text-lg font-bold">Escolha de Data</h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Calendário centralizado com fundo branco */}
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(value: DateRange | undefined) =>
                    setRange(value ?? { from: undefined, to: undefined })
                  }
                  //numberOfMonths={2}        // 2 meses lado a lado ajuda a escolher intervalos
                  defaultMonth={range.from} // mantém o mês focado no início escolhido (se houver)
                />
              </div>
            </div>

            {/* Inputs adicionais */}
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-sm font-medium">Número de pessoas do gênero masculino</Label>
                <Input
                  type="number"
                  value={men}
                  onChange={(e) => setMen(Number(e.target.value))}
                  className="border border-[#2E361D] rounded-md focus:outline-none focus:ring-0 focus:border-[#2E361D]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Número de pessoas do gênero feminino</Label>
                <Input
                  type="number"
                  value={women}
                  onChange={(e) => setWomen(Number(e.target.value))}
                  className="border border-[#2E361D] rounded-md focus:outline-none focus:ring-0 focus:border-[#2E361D]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Nomes dos participantes masculinos</Label>
                <textarea
                  className="w-full mt-2 p-2 border border-[#2E361D] rounded-md h-16 resize-none 
                             focus:outline-none focus:ring-0 focus:border-[#2E361D]"
                  placeholder="Digite os nomes aqui, separados por quebra de linha"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Nomes dos participantes femininos</Label>
                <textarea
                  className="w-full mt-2 p-2 border border-[#2E361D] rounded-md h-16 resize-none 
                             focus:outline-none focus:ring-0 focus:border-[#2E361D]"
                  placeholder="Digite os nomes aqui, separados por quebra de linha"
                />
              </div>
            </div>
          </div>

          {/* Botão salvar (desabilita até ter from e to) */}
          <div className="flex justify-end">
            <Button
              className="mt-3 bg-[#2E361D] text-white rounded-full px-8 py-2 shadow-md hover:bg-[#232918]"
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
