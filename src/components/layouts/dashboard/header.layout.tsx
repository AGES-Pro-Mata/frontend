import { cn } from "@/lib/utils";
import { HeaderDrawerMobile } from "@/components/layouts/dashboard/components/headerDrawerMobile";
import { useCartStore } from "@/store/cartStore";
import {
  Building2,
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  Mountain,
  LogIn,
  LogOut,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useIsAdmin, userQueryOptions } from "@/api/user";
import CartButton from "@/components/buttons/cartButton";
import { HeaderButton } from "@/components/buttons/headerButton";
import { useQuery } from "@tanstack/react-query";
import { useLogout } from "@/hooks/useLogout";
import { MoonLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import LanguageSelect from "@/components/buttons/languageSelector";

type HeaderLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

// Language switcher moved to shared LanguageSelect component

export const HeaderLayout = ({ className, children }: HeaderLayoutProps) => {
  const { t } = useTranslation();
  const pathname = useRouterState().location.pathname;
  const isAdmin = useIsAdmin();
  const { data: user, isPending: isLoading } = useQuery(userQueryOptions);
  const isLoggedIn = !!user;
  const cartItemCount = useCartStore((state) => state.itemCount);
  const { logout } = useLogout();


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
          label={t("home")}
          to="/"
          icon={<Mountain />}
          selected={pathname === "/"}
        />
        <HeaderButton
          label={t("reserve")}
          to="/reserve"
          icon={<Building2 />}
          selected={pathname === "/reserve"}
        />
        {isLoading ? (
          <MoonLoader size={20} />
        ) : (
          isLoggedIn && (
            <HeaderButton
              label={t("myReservations")}
              to="/user/my-reservations"
              icon={<CalendarDays />}
              selected={pathname === "/user/my-reservations"}
            />
          )
        )}
        {isLoading ? (
          <MoonLoader size={20} />
        ) : (
          isAdmin && (
            <HeaderButton
              label={t("admin")}
              to="/admin/reports"
              icon={<LayoutDashboard />}
              selected={pathname === "/admin/reports"}
            />
          )
        )}
      </div>

      <div className="hidden md:flex w-auto justify-end items-center gap-6">
        {isLoading ? (
          <MoonLoader size={20} />
        ) : isLoggedIn ? (
          <>
            <HeaderButton
              secondary
              label={user?.name || "Usuário"}
              to="/user/profile"
              icon={<CircleUserRound />}
            />
            <CartButton itemCount={cartItemCount} />
          </>
        ) : (
          <HeaderButton
            secondary
            label={t("nav.login")}
            to="/auth/login"
            icon={<LogIn />}
          />
        )}
  <LanguageSelect />
        {isLoading ? (
          <MoonLoader size={20} />
        ) : (
          isLoggedIn && (
            <HeaderButton
              secondary
              label={t("nav.logout")}
              icon={<LogOut />}
              onClick={logout}
            />
          )
        )}
      </div>

      <HeaderDrawerMobile />
      {children}
    </div>
  );
};
