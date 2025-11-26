import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ExperienceDTO } from "@/types/experience";
type CartStore = {
  items: ExperienceDTO[];
  isOpen: boolean;
  addItem: (experience: ExperienceDTO) => void;
  removeItem: (experienceId: ExperienceDTO["id"]) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

export const noopStorage: Storage = {
  get length() {
    return 0;
  },
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

export function getDefaultStorage(): Storage {
  return typeof window === "undefined" ? noopStorage : localStorage;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (experience) =>
        set((state) => {
          const alreadyExists = state.items.some(
            (item) => item.id === experience.id
          );
          const items = alreadyExists
            ? state.items.map((item) =>
                item.id === experience.id ? experience : item
              )
            : [...state.items, experience];

          return { items };
        }),
      removeItem: (experienceId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== experienceId),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "promata-cart",
      storage: createJSONStorage(getDefaultStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.closeCart();
      },
    }
  )
);
