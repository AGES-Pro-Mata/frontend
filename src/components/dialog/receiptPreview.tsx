/* eslint-disable padding-line-between-statements */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/button/defaultButton";
import { cn } from "@/lib/utils";
import { Download, Loader2, XIcon } from "lucide-react";

type ReceiptPreviewProps = {
  src: string;
  title?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  downloadFileName?: string;
  className?: string;
  height?: string | number;
  width?: string | number;
};

export function ReceiptPreview({
  src,
  title = "Visualizar Arquivo",
  trigger,
  open,
  onOpenChange,
  downloadFileName,
  className,
}: ReceiptPreviewProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    if (actualOpen) {
      setIsLoading(true);
      setError(null);
      setReloadKey((k) => k + 1);
    }
  }, [src, actualOpen]);

  function handleOpenChange(next: boolean) {
    if (isControlled) {
      onOpenChange?.(next);
    } else {
      setInternalOpen(next);
      onOpenChange?.(next);
    }
  }

  async function handleDownload() {
    try {
      const response = await fetch(src);

      if (!response.ok) throw new Error("Falha ao baixar o arquivo");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${downloadFileName || "documento"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("Erro ao baixar o arquivo");
    }
  }

  const frameStyles: React.CSSProperties = {
    height: "100%",
    width: "100%",
    border: 0,
    background: "#fff",
    display: "block",
  };

  async function getFileTypeByHeader(url: string): Promise<"image" | "pdf" | "other"> {
    try {
      const response = await fetch(url, { method: "HEAD" });

      const contentType = response.headers.get("Content-Type") || "";

      if (contentType.startsWith("image/")) return "image";
      if (contentType === "application/pdf") return "pdf";
    } catch {
      // fallback
    }

    return "other";
  }

  const [fileType, setFileType] = React.useState<"image" | "pdf" | "other">("other");

  React.useEffect(() => {
    (async () => {
      const headerType = await getFileTypeByHeader(src);
      setFileType(headerType);
    })();
  }, [src]);

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "w-full bg-white dark:bg-neutral-900 shadow-xl p-0 sm:p-4 !max-w-[1000px]",
          className,
        )}
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between gap-4 pb-2">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base sm:text-lg">{title}</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            {downloadFileName && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading || !!error}
                label={
                  <>
                    <Download className="size-4" />
                    <span className="hidden sm:inline">Baixar</span>
                  </>
                }
              />
            )}
            <DialogDescription />
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fechar"
                label={<XIcon className="size-4" />}
              />
            </DialogClose>
          </div>
        </DialogHeader>
        <div className="relative border rounded-md overflow-hidden bg-white dark:bg-neutral-950 min-h-[200px] flex items-center justify-center w-full h-[70vh]">
          {isLoading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm z-10">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-xs text-muted-foreground">Carregando Arquivo...</span>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center z-10 bg-background/90">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setReloadKey((k) => k + 1);
                }}
                label="Tentar Novamente"
              />
            </div>
          )}
          {fileType === "pdf" ? (
            <iframe
              key={reloadKey}
              title={title}
              src={src}
              style={frameStyles}
              className={cn(
                "flex w-full h-full transition-opacity duration-300 min-h-[200px]",
                isLoading || error ? "opacity-0" : "opacity-100",
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError("Não foi possível carregar o PDF");
              }}
              tabIndex={0}
              aria-label={title}
              allowFullScreen
            />
          ) : (
            <img
              key={reloadKey}
              src={src}
              alt={title}
              style={frameStyles}
              className={cn(
                "flex w-full h-full object-cover transition-opacity duration-300 min-h-[200px]",
              )}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setError("Não foi possível carregar a imagem");
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReceiptPreview;
