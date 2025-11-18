import { createStore, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthStoreType = {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
};

export const authStore = createStore(
  persist<AuthStoreType>(
    (set) => ({
      isAdmin: false,
      setIsAdmin: (isAdmin) => {
        set({ isAdmin });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
    }
  )
);

export const useAuthStore = () => useStore(authStore);
