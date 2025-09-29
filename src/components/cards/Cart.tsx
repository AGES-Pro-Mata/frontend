import React from "react";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/cards/CartItem";
import { X } from "lucide-react";

interface CartProps {
  onClose: () => void;
}

export const Cart: React.FC<CartProps> = ({ onClose }) => {
  const experiences = useCartStore((state) => state.experiences);
  const removeExperience = useCartStore((state) => state.removeExperience);
  const itemCount = experiences.length;

  return (
    // Overlay semi-transparente que cobre a tela inteira
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-[10000] flex justify-end"
      aria-modal="true"
      role="dialog"
    >
      {/* Painel do Carrinho */}
      <div
        onClick={(e) => e.stopPropagation()} // Impede que cliques dentro do painel fechem o carrinho
        className="w-full max-w-lg h-full bg-card text-foreground flex flex-col shadow-2xl"
      >
        {/* Cabeçalho do Carrinho */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            Você possui {itemCount} {itemCount === 1 ? 'item' : 'itens'} para reservar
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Carrinho (com a lista de itens) */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {itemCount > 0 ? (
            experiences.map((exp) => (
              <CartItem
                key={exp.id}
                experience={exp}
                onRemove={() => removeExperience(exp.id)}
              />
            ))
          ) : (
            <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                <p className="text-lg">Seu carrinho está vazio.</p>
                <p className="text-sm">Adicione experiências para vê-las aqui.</p>
            </div>
          )}
        </div>
        
        {/* Rodapé do Carrinho */}
        {itemCount > 0 && (
            <div className="p-4 border-t border-border mt-auto">
                <button className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity">
                    Finalizar Reserva
                </button>
            </div>
        )}
      </div>
    </div>
  );
};