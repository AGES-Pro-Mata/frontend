import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography/typography";
import { cn } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { Link } from "@tanstack/react-router";

type HeaderLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

export function AdminLayoutHeader({ className, children }: HeaderLayoutProps) {
  const { logout } = useLogout();

  return (
    <div
      className={cn(
        "flex sticky top-0 !w-full h-20 !py-4 !px-6 bg-white drop-shadow-md items-center justify-between gap-4",
        className
      )}
    >
      <Link
        to="/"
        className="cursor-pointer"
      >
        <img
          src="/logo-pro-mata-png.png"
          alt="Logo Pro Mata"
          className="w-40 object-fit"
        />
      </Link>
      <Typography variant="h3" className="text-black">
        Administrador
      </Typography>
      {children}
      <Button variant="link" size="lg" onClick={logout}>
        <Typography variant="h4" className="text-black">
          Sair
        </Typography>
        <LogOutIcon className="!h-5 !w-5 text-black mt-0.5" />
      </Button>
    </div>
  );
}
AdminLayoutHeader.displayName = "AdminLayout.Header";
