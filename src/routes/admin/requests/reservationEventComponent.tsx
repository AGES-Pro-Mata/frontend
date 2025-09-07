import { ReservationsLayout } from "../../../components/display/reservationsevents";
import type { ReservationEvent } from "../../../components/display/reservationsevents";

// Mock de eventos
const mockEvents: ReservationEvent[] = [
  { id: "1", user: "Usuário", status: "Reserva solicitada", date: "13/11/2025", time: "10:36" },
  { id: "2", user: "Você", status: "Usuários Solicitados\nEnvie os usuários restantes", date: "14/11/2025", time: "12:32" },
  { id: "3", user: "Usuário", status: "Usuários Enviados", date: "15/11/2025", time: "10:36" },
  { id: "4", user: "Você", status: "Reserva autorizada\nPagamento solicitado ao usuário", date: "15/11/2025", time: "11:05" },
  { id: "5", user: "Usuário", status: "Pagamento Efetuado", date: "15/11/2025", time: "11:45" },
  { id: "6", user: "Você", status: "Reserva aprovada", date: "16/11/2025", time: "09:00" },
  { id: "7", user: "Você", status: "Reserva recusada", date: "17/11/2025", time: "10:15" },
];


export function ReservationEventComponent() {
  return (
    <div className="p-6 flex justify-center">
      <ReservationsLayout events={mockEvents} />
    </div>
  );
}
