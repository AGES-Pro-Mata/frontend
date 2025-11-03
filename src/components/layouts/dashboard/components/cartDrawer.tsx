import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CartItem from "@/components/card/cartItem";
import { Button } from "@/components/button/defaultButton";
import { useCartStore } from "@/store/cartStore";
import { X } from "lucide-react";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const CartDrawer = () => {
  const { t } = useTranslation();

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
      modal={false}
    >
      <DrawerContent
        style={{ top: "5rem", bottom: 0 }}
        className="data-[vaul-drawer-direction=right]:!w-full data-[vaul-drawer-direction=right]:!max-w-[520px] bg-card border-none shadow-xl"
        overlayClassName="!top-20"
      >
        <DrawerHeader className="flex flex-row items-start justify-between px-6 pt-6 pb-4">
          <DrawerTitle className="text-left text-lg font-semibold text-main-dark-green">
            {heading}
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              type="button"
              onClick={closeCart}
              className="rounded-full p-1 text-main-dark-green transition-colors hover:bg-soft-white"
              aria-label={t("cartDrawer.closeButtonAria")}
            >
              <X className="h-5 w-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col gap-4 px-6 pb-6 bg-card">
          <div className="flex-1 overflow-y-auto pr-1 max-h-[calc(100vh-5rem-200px)]">
            {itemCount === 0 ? (
              <div className="flex h-full min-h-[240px] flex-col items-center justify-center rounded-[12px] border border-dashed border-banner bg-soft-white p-6 text-center text-sm text-on-banner-text">
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
                      className="bg-soft-white shadow-md"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-3 border-t border-banner pt-4">
            <Link
              to="/reserve/finish"
              onClick={() => {
                closeCart();
              }}
            >
              <Button
                className="w-full justify-center rounded-full py-3"
                disabled={itemCount === 0}
                label={<span>{t("cartDrawer.checkoutButton")}</span>}
              />
            </Link>
            <span
              className="text-center text-sm font-semibold text-main-dark-green transition-colors hover:text-main-dark-green/80 cursor-pointer"
              onClick={closeCart}
            >
              {t("cartDrawer.browseLink")}
            </span>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
