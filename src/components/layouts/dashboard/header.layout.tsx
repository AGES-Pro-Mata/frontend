import { cn } from "@/lib/utils";
import { HeaderDrawerMobile } from "./components/header-drawer-mobile";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

type HeaderLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

export const HeaderLayout = ({ className, children }: HeaderLayoutProps) => {
  return (
    <div
      className={cn(
        "flex sticky top-0 !w-full h-20 !py-4 !px-6 bg-banner drop-shadow-md items-center justify-between gap-4",
        className
      )}
    >
      <img
        src="/logo-pro-mata-png.png"
        alt="Logo Pro Mata"
        className="w-40 object-fit"
      />
      <div className="hidden md:flex justify-around gap-20 lg:gap-40 items-center w-auto">
        <div>Início</div>
        <div>Reservar</div>
        <div>Minhas reservas</div>
        <Link to="/admin/home">
          ADMIN
        </Link>
      </div>
      <div className="hidden md:flex w-auto justify-end items-center">
        <div>User</div>
        <div>Carrinho</div>
        <div>PT / EN</div>
      </div>

      <HeaderDrawerMobile />
      {children}
    </div>
  );
};
