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
import { useTranslation } from "react-i18next";

import { CreateRequestsRequest } from "@/entities/create-requests-request";
import type z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "../ui/form";
import { useCreateAdminRequest } from "@/hooks/requests/use-create-request-admin";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { MoonLoader } from "react-spinners";
import ReceiptPreview from "../dialog/receiptPreview";

export interface ReservationsLayoutProps {
  reservationGroupId: string;
}

export function ReservationCard({ event }: { event: TEventsReservationRequestAdminResponse }) {
  const { t } = useTranslation();
  const [openPdfModal, setOpenPdfModal] = React.useState(false);
  const isSelf = event.isSender;
  const date = dayjs(event.createdAt).format("DD/MM/YYYY");
  const time = dayjs(event.createdAt).format("HH:mm");

  const userColor = "text-green-700";

  return (
    <div className={cn("flex", isSelf ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-xl flex flex-col border-[0.5px] border-gray-300 shadow-md px-4 py-3 w-[55%] gap-2",
          isSelf ? "bg-blue-100" : "bg-gray-100",
        )}
      >
        <div className="flex justify-between items-baseline">
          <p className={cn("", { "font-bold": isSelf }, userColor)}>
            {event.name} {`(${event.email})`}
          </p>
          <span className="text-xs text-gray-500 ml-4">{date}</span>
        </div>

        <p className="font-semibold text-lg">{t(REQUESTS_LABEL[event.status ?? ""])}</p>
        {event.description && <p className="text-sm">{event.description}</p>}
        {event.fileUrl && (
          <Button
            label={t("requests.admin.viewReceipt")}
            variant="outline"
            onClick={() => setOpenPdfModal(true)}
          />
        )}
        <div className="flex justify-between items-center">
          <div className="text-left text-xs text-gray-500">
            <span>{time}</span>
          </div>
          {event.isRequester && (
            <span className="text-red-500">{t("requests.admin.requesterTag")}</span>
          )}
        </div>
      </div>
      <ReceiptPreview
        src={event.fileUrl ?? ""}
        open={openPdfModal}
        onOpenChange={() => setOpenPdfModal(false)}
      />
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
  const { t } = useTranslation();
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
    <div className="rounded-2xl border-[0.5px] border-gray-300 shadow-lg w-full mx-auto">
      <div className="flex flex-row items-center justify-between border-b-[0.5px] border-gray-300 px-6 py-4">
        <div className="text-xl font-bold text-gray-800">
          {t("requests.admin.reservationHeader")}
        </div>
        <div>
          {t("requests.admin.statusLabel")}:{" "}
          <span className="text-lg font-bold text-gray-800">
            {t(REQUESTS_LABEL[data.status ?? ""])}
          </span>
        </div>
        <span className="text-sm text-gray-500">{t("requests.admin.createdAt", { date })}</span>
      </div>

      <div className="h-[450px] relative">
        <ReservationEvents events={data.events} />
      </div>
      {data.status !== RequestsType.CANCELED && (
        <div className="flex flex-col rounded-b-2xl border-t-[0.5px] border-gray-300 bg-white px-6 py-4 gap-4 w-full">
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
                    {REQUESTS_ACTIONS_BUTTONS_ORDER[data.status].map(
                      (action: RequestsType, index: number) => (
                        <ToggleGroupItem
                          disabled={isPending}
                          key={index}
                          value={action}
                          className="border-1 !rounded-2xl border-gray-300 h-12 !w-full data-[state=on]:bg-contrast-green data-[state=on]:text-white"
                        >
                          {data.status === RequestsType.CANCELED_REQUESTED &&
                          action === RequestsType.CANCELED
                            ? t("requests.actions.approveCancellation")
                            : data.status === RequestsType.CANCELED_REQUESTED &&
                                action === RequestsType.CANCEL_REJECTED
                              ? t("requests.actions.rejectCancellation")
                              : t(REQUESTS_ACTIONS_LABEL[action])}
                        </ToggleGroupItem>
                      ),
                    )}
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
                      disabled={isPending}
                      onChange={(value) => field.onChange(value)}
                      value={field.value ?? ""}
                      placeholder={t("requests.admin.inputPlaceholder")}
                      className="flex-grow rounded-md border-gray-300 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-green-500 h-12"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="text-white font-semibold px-4 py-2 rounded-lg h-10 w-24"
                label={
                  isPending ? <MoonLoader size={22} color="#006324" /> : t("requests.admin.send")
                }
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
