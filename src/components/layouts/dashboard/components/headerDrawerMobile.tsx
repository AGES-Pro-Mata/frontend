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
import {
  CalendarRange,
  Home,
  LogIn,
  LogOut,
  Menu,
  PlusCircle,
  ShoppingCart,
  User2,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/api/user";
import { useTranslation } from "react-i18next";
import LanguageSelect from "@/components/button/languageSelector";
import { useCartStore } from "@/store/cartStore";
import { useLogout } from "@/hooks";

export function HeaderDrawerMobile() {
  const { t } = useTranslation();
  const { data: user } = useQuery(userQueryOptions);
  const isLoggedIn = !!user;
  const { logout } = useLogout();
  const openCart = useCartStore((state) => state.openCart);
  const cartItemsCount = useCartStore((state) => state.items.length);

  const handleCartClick = () => {
    openCart();
  };

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="flex md:hidden border-main-dark-green text-main-dark-green hover:bg-main-dark-green/10"
        >
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full w-80 bg-gradient-to-b from-main-dark-green via-main-dark-green/95 to-main-dark-green/90 text-white border-r border-main-dark-green shadow-xl flex flex-col">
        <DrawerHeader className="!flex-row justify-between items-center gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <DrawerClose asChild>
              <button className="p-1 rounded-md hover:bg-white/10 transition-colors">
                <XCircle className="size-5" />
              </button>
            </DrawerClose>
            <DrawerTitle className="text-lg font-semibold tracking-wide">
              {t("common.menu")}
            </DrawerTitle>
          </div>
          {/* keep header minimal on mobile */}
        </DrawerHeader>
        <Separator className="opacity-30" />
        <nav className="flex-1 flex flex-col gap-1 px-3 py-5 overflow-y-auto text-sm font-medium">
          <section className="flex flex-col gap-1">
            <DrawerClose asChild>
              <Link
                to="/"
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
              >
                <Home className="size-4" /> {t("nav.home")}
              </Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link
                to="/reserve"
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
              >
                <CalendarRange className="size-4" /> {t("nav.reserve")}
              </Link>
            </DrawerClose>
            {isLoggedIn && (
              <>
                <DrawerClose asChild>
                  <Link
                    to="/user/my-reservations"
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
                  >
                    <CalendarRange className="size-4" /> {t("nav.myReservations")}
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <Link
                    to="/user/profile"
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
                  >
                    <User2 className="size-4" /> {t("nav.profile")}
                  </Link>
                </DrawerClose>
                <DrawerClose asChild>
                  <button
                    type="button"
                    onClick={handleCartClick}
                    className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
                  >
                    <span className="relative inline-flex items-center gap-2">
                      <ShoppingCart className="size-4" />
                      {cartItemsCount > 0 && (
                        <span className="inline-flex min-w-5 justify-center rounded-full bg-banner px-2 py-0.5 text-xs font-semibold text-main-dark-green">
                          {cartItemsCount}
                        </span>
                      )}
                    </span>
                    {t("common.cart")}
                  </button>
                </DrawerClose>
              </>
            )}
          </section>
          <Separator className="my-4 opacity-30" />
          {!isLoggedIn && (
            <section className="flex flex-col gap-1">
              <DrawerClose asChild>
                <Link
                  to="/auth/login"
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
                >
                  <LogIn className="size-4" /> {t("nav.login")}
                </Link>
              </DrawerClose>
              <DrawerClose asChild>
                <Link
                  to="/auth/register"
                  className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
                >
                  <PlusCircle className="size-4" /> {t("nav.register")}
                </Link>
              </DrawerClose>
            </section>
          )}
        </nav>
        {/* Footer with language selector and logout pinned at bottom */}
        <div className="mt-auto px-3 py-4 border-t border-white/10 flex items-center justify-between gap-3">
          <LanguageSelect variant="drawer" orientation="horizontal" />
          {isLoggedIn && (
            <DrawerClose asChild>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 ring-white/40 transition-colors"
              >
                <LogOut className="size-4" /> {t("nav.logout")}
              </button>
            </DrawerClose>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
