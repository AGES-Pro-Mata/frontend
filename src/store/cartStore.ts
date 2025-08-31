import { create } from 'zustand';

interface CartState {
  itemCount: number;
  increment: () => void;
  decrement: () => void;
  setItemCount: (count: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  itemCount: 0,
  increment: () => set((state) => ({ itemCount: Math.min(99, state.itemCount + 1) })),
  decrement: () => set((state) => ({ itemCount: Math.max(0, state.itemCount - 1) })),
  setItemCount: (count) => set({ itemCount: Math.max(0, Math.min(99, count)) }),
}));
