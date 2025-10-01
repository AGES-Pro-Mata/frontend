import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ExperienceDTO } from "@/types/experiences";
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

const noopStorage: Storage = {
  get length() {
    return 0;
  },
  clear: () => undefined,
  getItem: () => null,
  key: () => null,
  removeItem: () => undefined,
  setItem: () => undefined,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (experience) =>
        set((state) => {
          const alreadyExists = state.items.some((item) => item.id === experience.id);
          const items = alreadyExists
            ? state.items.map((item) => (item.id === experience.id ? experience : item))
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
      storage: createJSONStorage(() => (typeof window === "undefined" ? noopStorage : localStorage)),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.closeCart();
      },
    },
  ),
);
