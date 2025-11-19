import { cn } from "@/lib/utils";
import { RequestsType } from "@/utils/enums/requests-enum";
import type { RequestEventAdminHistoryResponse } from "@/hooks/reservations/useMyReservations";
import dayjs from "dayjs";
import { REQUESTS_ICONS, REQUESTS_LABEL } from "@/utils/consts/requests-consts";
export interface Step {
  type: RequestsType;
  description?: string;
  date?: string;
}
export type StepperProps = {
  steps: RequestEventAdminHistoryResponse[];
};

export default function Stepper({ steps = [] }: StepperProps) {
  return (
    <>
      <div className="h-full flex items-center w-max overflow-x-auto">
        {steps.map((step, index) => {
          const isActive = index === steps.length - 1;
          const isCompleted = index < steps.length - 1;
          const Icon = REQUESTS_ICONS[step.type ?? ""];

          return (
            <div key={index} className="flex flex-col items-center text-center min-w-40 relative">
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-6 left-1/2 w-40 h-1 -z-10",
                    index < steps.length - 2 && "bg-blue-400",
                    index === steps.length - 2 && "bg-blue-700",
                    steps[index + 1]?.type == RequestsType.APPROVED &&
                      index === steps.length - 2 &&
                      "bg-contrast-green",
                    steps[index + 1]?.type == RequestsType.CANCELED &&
                      index === steps.length - 2 &&
                      "bg-default-red",
                  )}
                />
              )}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow transition-all",
                  isCompleted && "bg-blue-400",
                  isActive && "bg-blue-700 scale-120",
                  step.type === RequestsType.APPROVED && "bg-contrast-green",
                  step.type === RequestsType.CANCELED && "bg-default-red",
                )}
              >
                {Icon && <Icon />}
              </div>

              <span className="mt-2 font-medium text-sm">{REQUESTS_LABEL[step.type]}</span>

              {step.createdAt && (
                <span className="text-xs text-gray-500">
                  {dayjs(step.createdAt).format("DD/MM/YYYY HH:mm")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
