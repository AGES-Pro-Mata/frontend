import type { PropsWithChildren, ReactNode } from "react";

import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";

type ReserveStepLayoutProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
}>;

export function ReserveStepLayout({
  title,
  subtitle,
  currentStep,
  totalSteps,
  description,
  footer,
  children,
  className,
}: ReserveStepLayoutProps) {
  return (
    <section className={cn("min-h-screen py-10", className)}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 rounded-3xl border border-dark-gray/20 bg-card/20 px-8 py-8 shadow-sm">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div
                className="relative h-3 flex-1 rounded-full bg-dark-gray/15"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-valuenow={currentStep}
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-main-dark-green transition-[width]"
                  style={{
                    width: `${(Math.min(currentStep, totalSteps) / totalSteps) * 100}%`,
                  }}
                />
              </div>
              <Typography className="text-sm font-semibold text-main-dark-green">
                {currentStep}/{totalSteps}
              </Typography>
            </div>

            <div className="flex flex-col gap-1">
              {subtitle && (
                <Typography className="text-xs font-semibold uppercase tracking-[0.12em] text-main-dark-green/70">
                  {subtitle}
                </Typography>
              )}
              <Typography variant="h3" className="text-main-dark-green">
                {title}
              </Typography>
              {description && (
                <Typography className="text-sm text-foreground/70">
                  {description}
                </Typography>
              )}
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-6">{children}</main>

        {footer && (
          <footer className="rounded-3xl border border-transparent bg-transparent">
            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-end sm:gap-4">
              {footer}
            </div>
          </footer>
        )}
      </div>
    </section>
  );
}
