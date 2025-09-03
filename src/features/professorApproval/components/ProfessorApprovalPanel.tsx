import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ProfessorApprovalPanel() {
  return (
    <Card className="w-full max-w-md border-2 rounded-xl">
      <CardContent className="p-6">
        {/* Editor de texto (simples) */}
        <Textarea
          className="mb-6 min-h-[280px] resize-none"
          placeholder="Digite alguma observação sobre essa solicitação"
        />

        {/* Botões de ação */}
        <div className="flex gap-4 mb-4">
          <Button className="bg-red-600 hover:bg-red-700 text-white font-semibold flex-1 cursor-pointer">
            Recusar professor
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold flex-1 cursor-pointer">
            Aprovar professor
          </Button>
        </div>

        {/* Botão de comprovante */}
        <Button
          className="w-full bg-[#D9D2C7] text-white font-semibold cursor-pointer"
        >
          Visualizar comprovante
        </Button>
      </CardContent>
    </Card>
  );
}