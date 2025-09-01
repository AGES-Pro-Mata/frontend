import { cn } from "@/lib/utils";
import { HeaderDrawerMobile } from "./components/header-drawer-mobile";
import CartButton from "@/components/ui/cartButton";
import { useCartStore } from "@/store/cartStore";
import { HeaderButton } from "@/components/HeaderButton";
import { Building2, Calendar, CircleUserRound, LayoutDashboard, Mountain } from "lucide-react";

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
        src="logo-pro-mata.svg "
        alt="Logo Pro Mata"
        className="w-40 object-fit"
      />
      <div className="hidden md:flex justify-around gap-20 lg:gap-40 items-center w-auto">
        <HeaderButton label="Início" icon={Mountain} />
        <HeaderButton label="Reservar" icon={Building2} />
        <HeaderButton label="Minhas reservas" icon={Calendar} />
        <HeaderButton label="Administrador" to="/admin/home" icon={LayoutDashboard} />
      </div>
      <div className="hidden md:flex w-auto justify-end items-center gap-6">
        <HeaderButton secondary label="João da Silva" icon={CircleUserRound} />
        <CartButton itemCount={useCartStore((state) => state.itemCount)} />
        <HeaderButton secondary label="PT / EN" />
      </div>

      <HeaderDrawerMobile />
      {children}
    </div >
  );
};
