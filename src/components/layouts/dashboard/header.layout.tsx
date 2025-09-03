import { cn } from "@/lib/utils";
import { HeaderDrawerMobile } from "./components/header-drawer-mobile";
import CartButton from "@/components/ui/cartButton";
import { useCartStore } from "@/store/cartStore";
import { HeaderButton } from "@/components/ui/HeaderButton";
import {
  Building2,
  CalendarDays,
  CircleUserRound,
  LayoutDashboard,
  Mountain,
} from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { useIsAdmin } from "@/api/user";
import { useTranslation } from "react-i18next";

type HeaderLayoutProps = {
  children?: React.ReactNode;
  className?: string;
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "pt" : "en");
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 rounded border bg-white shadow"
    >
      {i18n.language.toUpperCase()}
    </button>
  );
};

export const HeaderLayout = ({ className, children }: HeaderLayoutProps) => {
  const { t } = useTranslation();
  const pathname = useRouterState().location.pathname;
  const isAdmin = useIsAdmin();

  return (
    <div
      className={cn(
        "flex sticky top-0 !w-full h-20 !py-4 !px-6 bg-banner drop-shadow-md items-center justify-between gap-4 z-[9999]",
        className
      )}
    >
      <a
        href="https://www.pucrs.br/ima/pro-mata/"
        target="_blank"
        className="cursor-pointer"
      >
        <img
          src="logo-pro-mata.svg"
          alt="Logo Pro Mata"
          className="w-40 object-fit"
        />
      </a>

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
        <HeaderButton
          label={t("myReservations")}
          to="/my-reservations"
          icon={<CalendarDays />}
          selected={pathname === "/my-reservations"}
        />
        {isAdmin && (
          <HeaderButton
            label={t("admin")}
            to="/admin/reports"
            icon={<LayoutDashboard />}
            selected={pathname === "/admin/reports"}
          />
        )}
      </div>

      <div className="hidden md:flex w-auto justify-end items-center gap-6">
        <HeaderButton
          secondary
          label={t("userName")}
          to="/my-profile"
          icon={<CircleUserRound />}
        />
        <CartButton itemCount={useCartStore((state) => state.itemCount)} />
        <LanguageSwitcher />
      </div>

      <HeaderDrawerMobile />
      {children}
    </div>
  );
};
