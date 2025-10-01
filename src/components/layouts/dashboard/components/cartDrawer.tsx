import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import CartItem from "@/components/cards/CartItem";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { X } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const CartDrawer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  const closeCart = useCartStore((state) => state.closeCart);
  const removeItem = useCartStore((state) => state.removeItem);
  // talvez seja util const clearCart = useCartStore((state) => state.clearCart);

  const itemCount = items.length;

  const heading = useMemo(() => {
    if (!itemCount) {
      return t("cartDrawer.heading.empty");
    }

    if (itemCount === 1) {
      return t("cartDrawer.heading.single");
    }

    return t("cartDrawer.heading.plural", { count: itemCount });
  }, [itemCount, t]);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (open) openCart();
        else closeCart();
      }}
      direction="right"
    >
      <DrawerContent
        style={{ top: "5rem", bottom: 0 }}
        className="data-[vaul-drawer-direction=right]:!w-full data-[vaul-drawer-direction=right]:!max-w-[520px] bg-[#F4EEE6] border-none shadow-xl"
      >
        <DrawerHeader className="flex flex-row items-start justify-between px-6 pt-6 pb-4">
          <DrawerTitle className="text-left text-lg font-semibold text-[#4D3B2A]">
            {heading}
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full p-1 text-[#4D3B2A] transition-colors hover:bg-black/5"
              aria-label="Fechar carrinho"
            >
              <X className="h-5 w-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-6 pb-6">
          <div className="flex-1 overflow-y-auto pr-1 max-h-[calc(100vh-5rem-200px)]">
            {itemCount === 0 ? (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[12px] border border-dashed border-[#CDBBA7] bg-white/60 p-6 text-center text-sm text-[#6F5C49]">
                <p>{t("cartDrawer.emptyState.title")}</p>
                <p className="mt-1">{t("cartDrawer.emptyState.subtitle")}</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {items.map((experience) => (
                  <li key={experience.id} className="flex justify-center">
                    <CartItem
                      experience={experience}
                      onRemove={removeItem}
                      className="bg-[#FDF8F3] shadow-md"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 border-t border-[#DCCEBF] pt-4">
            <Button
              type="button"
              className="w-full justify-center rounded-full bg-emerald-600 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200"
              disabled={itemCount === 0}
              onClick={() => {
                closeCart();
                navigate({ to: "/user/my-reservations" });
              }}
            >
              {t("cartDrawer.checkoutButton")}
            </Button>
            <Link
              to="/reserve/finish"
              className="text-center text-sm font-semibold text-[#4D3B2A] transition-colors hover:text-[#2F271E]"
              onClick={closeCart}
            >
              {t("cartDrawer.browseLink")}
            </Link>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
