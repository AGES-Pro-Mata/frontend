import { create } from "zustand";
import { persist } from "zustand/middleware"; // Importa o middleware de persistência
import type { ExperienceDTO } from "@/types/experiences";

// A "planta" do nosso novo store
interface CartState {
  experiences: ExperienceDTO[]; // Agora guardamos a LISTA de experiências
  addExperience: (experience: ExperienceDTO) => void;
  removeExperience: (experienceId: number | string) => void;
  // A função para pegar a contagem de itens continua existindo
  getCartItemCount: () => number; 
}

export const useCartStore = create<CartState>()(
  // A função 'persist' envolve toda a nossa lógica
  persist(
    (set, get) => ({
      // O estado inicial agora é uma lista vazia
      experiences: [],

      // Função para ADICIONAR uma experiência completa à lista
      addExperience: (experience) => {
        if (!get().experiences.some((item) => item.id === experience.id)) {
          set((state) => ({
            experiences: [...state.experiences, experience],
          }));
        }
      },

      // Função para REMOVER uma experiência da lista pelo seu ID
      removeExperience: (experienceId) => {
        set((state) => ({
          experiences: state.experiences.filter(
            (exp) => exp.id !== experienceId
          ),
        }));
      },

      // A função que seu header vai usar para mostrar o número
      getCartItemCount: () => {
        return get().experiences.length;
      },
    }),
    {
      name: "cart-storage", // Isso salva tudo no localStorage do navegador
    }
  )
);