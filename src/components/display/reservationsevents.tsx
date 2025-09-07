import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type ReservationEvent = {
  id: string;
  user: "Usuário" | "Você";
  status: string;
  date: string;
  time: string;
  avatarUrl?: string;
};

export interface ReservationsLayoutProps {
  events: ReservationEvent[];
  className?: string;
}

export function ReservationCard({ event }: { event: ReservationEvent }) {
  const isSelf = event.user === "Você";
  const statusLines = event.status.split('\n');

  const isRecusada = event.status.includes("recusada");
  const userColor = isSelf
    ? "text-green-600"
    : isRecusada
    ? "text-red-600"
    : "text-green-700";

  return (
    <div className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-xl border shadow-md px-4 py-3 max-w-md",
          isSelf ? "bg-blue-100 border-blue-200" : "bg-white border-gray-200"
        )}
      >
        <div className="flex justify-between items-baseline">
          <p className={cn("font-bold", userColor)}>
            {event.user}
          </p>
          <span className="text-xs text-gray-500 ml-4">{event.date}</span>
        </div>

        <div className="mt-1">
          {statusLines.map((line, index) => (
            <p
              key={index}
              className={cn({
                "text-base font-semibold": index === 0,
                "text-red-600": index === 0 && isRecusada,
                "text-black": index === 0 && !isRecusada,
                "text-sm text-gray-700 italic mt-1": index > 0,
              })}
            >
              {line}
            </p>
          ))}
        </div>

        <div className="text-left text-xs text-gray-500 mt-1">
          <span>{event.time}</span>
        </div>
      </div>
    </div>
  );
}

export function ReservationEvents({
  events,
  className,
}: {
  events: ReservationEvent[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {events.map((event) => (
        <ReservationCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export function ReservationsLayout({ events }: ReservationsLayoutProps) {
  return (
    <div className="rounded-2xl border-2 shadow-lg w-full max-w-4xl mx-auto overflow-hidden">
      <div className="flex flex-row items-center justify-between border-b px-6 py-4">
        <div className="text-xl font-bold text-gray-800">Ações da reserva</div>
        <span className="text-sm text-gray-500">
          Data de envio: 13/11/2025
        </span>
      </div>
      <div className="p-6 h-[400px] overflow-y-auto">
        <ReservationEvents events={events} />
      </div>
      <div className="border-t-2 bg-white px-6 py-4">
        <div className="flex gap-4 mb-4 flex-wrap">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold">
            SOLICITAR PAGAMENTO
          </Button>
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold"
          >
            SOLICITAR USUÁRIO
          </Button>
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold"
          >
            RECUSAR RESERVA
          </Button>
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 hover:bg-gray-100 font-semibold"
          >
            ACEITAR RESERVA
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Digite para o usuário"
            className="flex-grow rounded-md border-gray-300 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-green-500 h-12"
          />
          <Button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg h-10 w-24"
          >
            ENVIAR
          </Button>
        </div>
      </div>
    </div>
  );
}