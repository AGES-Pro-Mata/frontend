import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Menu, XCircle, LogOut, Home, CalendarRange, ShoppingCart, User2, PlusCircle, LogIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/api/user";
import { useLogout } from "@/hooks/useLogout";
import { useTranslation } from "react-i18next";

export function HeaderDrawerMobile() {
  const { t } = useTranslation();
  const { data: user } = useQuery(userQueryOptions);
  const isLoggedIn = !!user;
  const { logout } = useLogout();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="flex md:hidden border-main-dark-green text-main-dark-green hover:bg-main-dark-green/10">
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full w-80 bg-gradient-to-b from-main-dark-green via-main-dark-green/95 to-main-dark-green/90 text-white border-r border-main-dark-green shadow-xl">
        <DrawerHeader className="!flex-row justify-between items-center gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <DrawerClose asChild>
              <button className="p-1 rounded-md hover:bg-white/10 transition-colors">
                <XCircle className="size-5" />
              </button>
            </DrawerClose>
            <DrawerTitle className="text-lg font-semibold tracking-wide">{t("common.menu")}</DrawerTitle>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium bg-white/10 px-2 py-1 rounded-md">PT / EN</div>
        </DrawerHeader>
        <Separator className="opacity-30" />
        <nav className="flex flex-col gap-1 px-3 py-5 overflow-y-auto text-sm font-medium">
          <section className="flex flex-col gap-1">
            <DrawerClose asChild>
              <Link to="/" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                <Home className="size-4" /> {t("nav.home")}
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link to="/reserve" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                <CalendarRange className="size-4" /> {t("nav.reserve")}
              </Link>
            </DrawerClose>
            {isLoggedIn && (
              <>
                <DrawerClose asChild>
                  <Link to="/user/my-reservations" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                    <CalendarRange className="size-4" /> {t("nav.myReservations")}
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link to="/user/profile" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                    <User2 className="size-4" /> {t("nav.profile")}
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link to="/user/profile" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                    <ShoppingCart className="size-4" /> {t("common.cart")}
                  </Link>
                </DrawerClose>
              </>
            )}
          </section>
          <Separator className="my-4 opacity-30" />
          {!isLoggedIn && (
            <section className="flex flex-col gap-1">
              <DrawerClose asChild>
                <Link to="/auth/login" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                  <LogIn className="size-4" /> {t("nav.login")}
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link to="/auth/register" className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors">
                  <PlusCircle className="size-4" /> {t("nav.register")}
                </Link>
              </DrawerClose>
            </section>
          )}
          {isLoggedIn && (
            <section className="mt-auto pt-4 flex flex-col gap-2">
              <DrawerClose asChild>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
                >
                  <LogOut className="size-4" /> {t("nav.logout")}
                </button>
              </DrawerClose>
            </section>
          )}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
