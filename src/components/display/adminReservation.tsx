import { Typography } from "../typography/typography";
import { SummaryExperience } from "./summaryExperience";
import { ReservationsLayout } from "./reservationsevents";
import { Users } from "lucide-react";

const mockReservationData = {
  nome: "Usuario 1",
  telefone: "(61) 99999-9999",
  dataNascimento: "11/11/2000",
  cpf: "123.456.789-09",
  genero: "Masculino",
  pessoas: { homens: 2, mulheres: 3, outros: 1 },
  observacoes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam gravida massa et mauris tempor quis suscipit quam luctus. Sed ligula justo, semper quis pretium quis, consectetur ut tortor ipsum elit. Sed augue justo, luctus et massa ac, sagittis consequat ex. Aenean gravida massa et mauris tempor quis suscipit quam luctus.",
  experiencias: [
    {
      experience: "Experiência X",
      startDate: "2025-09-15",
      endDate: "2025-09-16", 
      price: 356.90,
      capacity: 10,
      locale: "pt-BR" as const
    }
  ]
};

const mockEvents = [
  {
    id: "1",
    user: "Usuário" as const,
    status: "Reserva solicitada",
    date: "13/11/2025",
    time: "21:36"
  },
  {
    id: "2", 
    user: "Você" as const,
    status: "Usuários Solicitados\nEnvio de usuários restantes",
    date: "14/11/2025",
    time: "21:36"
  },
  {
    id: "3",
    user: "Usuário" as const,
    status: "Usuários Enviados", 
    date: "15/11/2025",
    time: "21:36"
  }
];

export function AdminReservation() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Informações da reserva */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-4 mb-6">
          <Typography variant="h2" className="text-black">
            Informações da reserva
          </Typography>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            Homens: {mockReservationData.pessoas.homens} • 
            Mulheres: {mockReservationData.pessoas.mulheres} • 
            Outros: {mockReservationData.pessoas.outros}
          </div>
        </div>
        
        {/* Informações em formato de input readonly */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Nome *</label>
            <input 
              type="text" 
              value={mockReservationData.nome} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Telefone *</label>
            <input 
              type="text" 
              value={mockReservationData.telefone} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Data de Nascimento *</label>
            <input 
              type="text" 
              value={mockReservationData.dataNascimento} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">CPF *</label>
            <input 
              type="text" 
              value={mockReservationData.cpf} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Gênero *</label>
            <input 
              type="text" 
              value={mockReservationData.genero} 
              readOnly 
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed"
            />
          </div>
          
          <div></div> {/* Espaço vazio para manter o grid */}
        </div>

        {/* Área de observações */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">Observações</label>
          <textarea
            value={mockReservationData.observacoes}
            readOnly
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 cursor-not-allowed resize-none"
          />
        </div>

        {/* Cards das experiências usando SummaryExperience */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {mockReservationData.experiencias.map((exp, index) => (
            <SummaryExperience
              key={index}
              experience={exp.experience}
              startDate={exp.startDate}
              endDate={exp.endDate}
              price={exp.price}
              capacity={exp.capacity}
              locale={exp.locale}
            />
          ))}
          {/* Cards adicionais para completar o layout */}
          <div className="bg-gray-100 rounded-2xl p-4 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[150px]">
            <Typography variant="body" className="text-gray-500">
              Experiência X
            </Typography>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[150px]">
            <Typography variant="body" className="text-gray-500">
              Experiência X
            </Typography>
          </div>
          <div className="bg-gray-100 rounded-2xl p-4 border-2 border-dashed border-gray-300 flex items-center justify-center min-h-[150px]">
            <Typography variant="body" className="text-gray-500">
              Experiência X
            </Typography>
          </div>
        </div>
      </div>

      {/* Ações da reserva usando ReservationsLayout */}
      <ReservationsLayout events={mockEvents} />
    </div>
  );
}
