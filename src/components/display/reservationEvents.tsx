import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import React from "react";
import dayjs from "dayjs";
import type { TEventsReservationRequestAdminResponse } from "@/entities/reservation-request-response";
import {
  RESERVATIONS_ADMIN_REQUESTS_QUERY_KEY,
  useGetReservationsAdminRequest,
} from "@/hooks/requests/use-get-reservation-request";
import {
  REQUESTS_ACTIONS_BUTTONS_ORDER,
  REQUESTS_ACTIONS_LABEL,
  REQUESTS_LABEL,
} from "@/utils/consts/requests-consts";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { RequestsType } from "@/utils/enums/requests-enum";
import { Button } from "../button/defaultButton";

import { CreateRequestsRequest } from "@/entities/create-requests-request";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { useCreateAdminRequest } from "@/hooks/requests/use-create-request-admin";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export interface ReservationsLayoutProps {
  reservationGroupId: string;
}

export function ReservationCard({ event }: { event: TEventsReservationRequestAdminResponse }) {
  const isSelf = event.isSender;
  const date = dayjs(event.createdAt).format("DD/MM/YYYY");
  const time = dayjs(event.createdAt).format("HH:mm");

  const userColor = "text-green-700";

  return (
    <div className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-xl flex flex-col border-[0.5px] border-black shadow-md px-4 py-3 w-[55%] gap-2",
          isSelf ? "bg-blue-100" : "bg-white",
        )}
      >
        <div className="flex justify-between items-baseline">
          <p className={cn("", { "font-bold": isSelf }, userColor)}>
            {event.name} {`(${event.email})`}
          </p>
          <span className="text-xs text-gray-500 ml-4">{date}</span>
        </div>

        <p className="font-semibold text-lg">{REQUESTS_LABEL[event.status ?? ""]}</p>
        {event.description && <p className="text-sm">{event.description}</p>}
        <div className="flex justify-between items-center">
          <div className="text-left text-xs text-gray-500">
            <span>{time}</span>
          </div>
          {event.isRequester && <span className="text-red-500">{"(Solicitante)"}</span>}
        </div>
      </div>
    </div>
  );
}

export function ReservationEvents({
  events,
}: {
  events: TEventsReservationRequestAdminResponse[];
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [events]);

  return (
    <div ref={containerRef} className={cn("overflow-y-auto flex p-6 h-full flex-col gap-4")}>
      {events.map((event) => (
        <ReservationCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export function ReservationsLayout({ reservationGroupId }: ReservationsLayoutProps) {
  const queryClient = useQueryClient();
  const { data } = useGetReservationsAdminRequest(reservationGroupId);
  const { mutateAsync, isPending } = useCreateAdminRequest();
  const date = dayjs(data?.createdAt).format("DD/MM/YYYY HH:mm");
  const form = useForm<
    z.input<typeof CreateRequestsRequest>,
    z.output<typeof CreateRequestsRequest>
  >({
    resolver: zodResolver(CreateRequestsRequest),
    defaultValues: {
      reservationGroupId,
      type: undefined,
      description: "",
    },
  });

  const handleSubmitForm = form.handleSubmit(async (formData) => {
    await mutateAsync(formData).then(async ({ data }) => {
      form.reset({
        reservationGroupId,
        type: undefined,
        description: undefined,
      });
      await queryClient.refetchQueries({
        queryKey: [RESERVATIONS_ADMIN_REQUESTS_QUERY_KEY, data.reservationGroupId],
      });
    });
  });

  if (!data) return;

  return (
    <div className="rounded-2xl border-[0.5px] border-black shadow-lg w-full mx-auto overflow-hidden">
      <div className="flex flex-row items-center justify-between border-b-[0.5px] border-black px-6 py-4">
        <div className="text-xl font-bold text-gray-800">Ações da reserva</div>
        <div>
          Status:{" "}
          <span className="text-lg font-bold text-gray-800">
            {REQUESTS_LABEL[data.status ?? ""]}
          </span>
        </div>
        <span className="text-sm text-gray-500">Data de criação: {date}</span>
      </div>
      <div className="h-[500px]">
        <ReservationEvents events={data.events} />
      </div>
      {data.status !== RequestsType.CANCELED && (
        <div className="flex flex-col border-t-[0.5px] border-black bg-white px-6 py-4 gap-4 w-full">
          <Form {...form}>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    className="gap-2 w-full"
                    onValueChange={(action: RequestsType) => field.onChange(action)}
                  >
                    {REQUESTS_ACTIONS_BUTTONS_ORDER[data.status].map((action, index) => (
                      <ToggleGroupItem
                        key={index}
                        value={action}
                        className="border-1 !rounded-2xl border-black h-12 !w-full data-[state=on]:bg-contrast-green data-[state=on]:text-white"
                      >
                        {REQUESTS_ACTIONS_LABEL[action]}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Input
                      onChange={(value) => field.onChange(value)}
                      value={field.value}
                      placeholder="Digite para o usuário"
                      className="flex-grow rounded-md border-gray-300 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-green-500 h-12"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="text-white font-semibold px-4 py-2 rounded-lg h-10 w-24"
                label={"ENVIAR"}
                onClick={() => void handleSubmitForm()}
                disabled={isPending}
              />
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
