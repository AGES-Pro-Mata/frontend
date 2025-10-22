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
import { Button } from "@/components/buttons/defaultButton";
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
  title = "Visualizar PDF",
  trigger,
  open,
  onOpenChange,
  downloadFileName,
  className,
  height = "70vh",
  width = "100%",
}: ReceiptPreviewProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (actualOpen) {
      setIsLoading(true);
      setError(null);
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

      if (!response.ok) throw new Error("Falha ao baixar o PDF");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${downloadFileName || "documento"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Erro ao baixar o arquivo");
    }
  }

  const frameStyles: React.CSSProperties = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "max-w-[90rem] w-full bg-white dark:bg-neutral-900 shadow-xl",
          className
        )}
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center justify-between gap-4">
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
        <div className="relative border rounded-md overflow-hidden bg-white dark:bg-neutral-950">
          {isLoading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/60 backdrop-blur-sm z-10">
              <Loader2 className="size-6 animate-spin" />
              <span className="text-xs text-muted-foreground">
                Carregando PDF...
              </span>
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center z-10 bg-background/90">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                label="Tentar Novamente"
              />
            </div>
          )}
          <iframe
            title={title}
            src={src}
            style={frameStyles}
            className={cn(
              "block w-full transition-opacity duration-300",
              isLoading || error ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError("Não foi possível carregar o PDF");
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReceiptPreview;
