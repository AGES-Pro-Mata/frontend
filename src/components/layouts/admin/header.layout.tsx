import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";

type HeaderLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

export function AdminLayoutHeader({ className, children }: HeaderLayoutProps) {
  return (
    <div
      className={cn(
        "flex sticky top-0 !w-full h-20 !py-4 !px-6 bg-white drop-shadow-md items-center justify-between gap-4",
        className
      )}
    >
      <a
        href="https://www.pucrs.br/ima/pro-mata/"
        target="_blank"
        className="cursor-pointer"
      >
        <img
          src="/logo-pro-mata-png.png"
          alt="Logo Pro Mata"
          className="w-40 object-fit"
        />
      </a>
      <Typography variant="h3" className="text-black">
        Administrador
      </Typography>
      {children}
      <Link to="/">
        <Button variant="link" size="lg">
          <Typography variant="h4" className="text-black">
            Sair
          </Typography>
          <LogOutIcon className="!h-5 !w-5 text-black mt-0.5" />
        </Button>
      </Link>
    </div>
  );
}
AdminLayoutHeader.displayName = "AdminLayout.Header";
