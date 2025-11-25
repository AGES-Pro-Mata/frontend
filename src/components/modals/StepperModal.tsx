import { cn } from "@/lib/utils";
import { RequestsType } from "@/utils/enums/requests-enum";
import type { RequestEventAdminHistoryResponse } from "@/hooks/reservations/useMyReservations";
import dayjs from "dayjs";
import { REQUESTS_ICONS, REQUESTS_LABEL } from "@/utils/consts/requests-consts";
import { useState } from "react";
export interface Step {
  type: RequestsType;
  description?: string;
  date?: string;
}
export type StepperProps = {
  steps: RequestEventAdminHistoryResponse[];
};

export default function Stepper({ steps = [] }: StepperProps) {
  const [descriptionToShow, setDescriptionToShow] = useState<number | null>(null);

  const handleShowDescription = (idx: number) => {
    setDescriptionToShow(idx === descriptionToShow ? null : idx);
  };

  return (
    <>
      <div className="h-full flex items-start w-auto max-w-[800px] overflow-x-auto py-4">
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
                      "bg-green-600",
                    steps[index + 1]?.type == RequestsType.CANCELED &&
                      index === steps.length - 2 &&
                      "bg-red-600",
                  )}
                />
              )}
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shadow transition-all",
                  isCompleted && "bg-blue-400",
                  isActive && "bg-blue-700 scale-120",
                  step.type === RequestsType.APPROVED && "bg-green-600",
                  step.type === RequestsType.CANCELED && "bg-red-600",
                )}
                onClick={() => handleShowDescription(index)}
              >
                {Icon && <Icon />}
              </div>

              <span className="mt-2 font-medium text-sm">{REQUESTS_LABEL[step.type]}</span>

              {step.createdAt && (
                <span className="text-xs text-gray-500">
                  {dayjs(step.createdAt).format("DD/MM/YYYY HH:mm")}
                </span>
              )}

              {step.description && descriptionToShow === index && (
                <span className="mt-1 text-xs text-gray-800">{step.description}</span>
              )}

              {step.description && descriptionToShow === index && (
                <span className="text-xs text-gray-500"></span>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
