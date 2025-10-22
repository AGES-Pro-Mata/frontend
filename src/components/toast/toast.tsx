import { type ExternalToast, Toaster, type ToasterProps, toast } from "sonner";
import { AlertTriangle, Check, Info, XOctagon } from "lucide-react";
import React from "react";

interface AppToastOptions extends Omit<ExternalToast, "description"> {
  description?: React.ReactNode;
  icon?: React.ReactNode;
  position?: ToasterProps["position"];
}

function base(content: React.ReactNode, opts?: AppToastOptions) {
  const { icon, description, className, position, ...rest } = opts ?? {};
  const baseClasses =
    "mx-auto w-full max-w-md sm:max-w-lg rounded-2xl p-4 shadow-xl flex items-start gap-4";
  const combinedClassName = [baseClasses, className].filter(Boolean).join(" ");

  return toast.custom(
    () => (
      <div className={combinedClassName}>
        {icon && <div className="mt-0.5 flex-shrink-0">{icon}</div>}
        <div className="flex flex-col text-sm leading-relaxed">
          {typeof content === "string" ? (
            <span className="font-medium">{content}</span>
          ) : (
            content
          )}
          {description && (
            <div className="text-xs opacity-80 mt-1">{description}</div>
          )}
        </div>
      </div>
    ),
    { ...rest, position: position ?? "top-center" }
  );
}

export const appToast = {
  success: (message: React.ReactNode, opts?: AppToastOptions) =>
    base(message, {
      ...opts,
      icon: opts?.icon || <Check className="size-5 text-white" />,
      className:
        "bg-contrast-green text-white border border-contrast-green shadow-md",
      duration: opts?.duration ?? 3500,
    }),
  error: (message: React.ReactNode, opts?: AppToastOptions) =>
    base(message, {
      ...opts,
      icon: opts?.icon || <XOctagon className="size-5 text-white" />,
      className:
        "bg-default-red text-white border border-default-red shadow-md",
      duration: opts?.duration ?? 4000,
    }),
  info: (message: React.ReactNode, opts?: AppToastOptions) =>
    base(message, {
      ...opts,
      icon: opts?.icon || <Info className="size-5 text-black" />,
      className: "bg-soft-blue border border-soft-blue text-black shadow-md",
      duration: opts?.duration ?? 3000,
    }),
  warning: (message: React.ReactNode, opts?: AppToastOptions) =>
    base(message, {
      ...opts,
      icon: opts?.icon || <AlertTriangle className="size-5 text-white" />,
      className: "bg-warning text-white border border-warning shadow-md",
      duration: opts?.duration ?? 4000,
    }),
  raw: toast,
};

export function AppToast(props: ToasterProps) {
  return <Toaster position="top-center" {...props} />;
}

export type { AppToastOptions };
