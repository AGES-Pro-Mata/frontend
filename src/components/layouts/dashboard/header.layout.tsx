import { cn } from "@/lib/utils";
import { HeaderDrawerMobile } from "./components/header-drawer-mobile";
import CartButton from "@/components/ui/cartButton";
import { useCartStore } from "@/store/cartStore";
import { HeaderButton } from "@/components/ui/headerButton";
import {
  Building2,
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  Mountain,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useIsAdmin } from "@/api/user";

type HeaderLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

export const HeaderLayout = ({ className, children }: HeaderLayoutProps) => {
  const pathname = useRouterState().location.pathname;
  const isAdmin = useIsAdmin();
  return (
    <div
      className={cn(
        "flex sticky top-0 !w-full h-20 !py-4 !px-6 bg-banner drop-shadow-md items-center justify-between gap-4 z-[9999]",
        className
      )}
    >
      <Link to="/">
        <img
          src="/logo-pro-mata.svg"
          alt="Logo Pro Mata"
          className="w-40 object-fit"
        />
      </Link>
      <div className="hidden md:flex justify-around gap-6 lg:gap-10 items-center w-auto">
        <HeaderButton
          label="Início"
          to="/"
          icon={<Mountain />}
          selected={pathname === "/"}
        />
        <HeaderButton
          label="Reservar"
          to="/reserve"
          icon={<Building2 />}
          selected={pathname === "/reserve"}
        />
        <HeaderButton
          label="Minhas reservas"
          to="/my-reservations"
          icon={<CalendarDays />}
          selected={pathname === "/my-reservations"}
        />
        {isAdmin && (
          <HeaderButton
            label="Administrador"
            to="/admin/reports"
            icon={<LayoutDashboard />}
            selected={pathname === "/admin/reports"}
          />
        )}
      </div>
      <div className="hidden md:flex w-auto justify-end items-center gap-6">
        <HeaderButton
          secondary
          label="João da Silva"
          to="/my-profile"
          icon={<CircleUserRound />}
        />
        <CartButton itemCount={useCartStore((state) => state.itemCount)} />
        <HeaderButton secondary label="PT / EN" />
      </div>

      <HeaderDrawerMobile />
      {children}
    </div>
  );
};
