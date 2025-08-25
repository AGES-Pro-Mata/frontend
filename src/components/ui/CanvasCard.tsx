type CanvasCardProps = {
  children: React.ReactNode;
  className?: string;
};
//Define o tipo de props que o componente CanvasCard aceita
//Inclui children (conteúdo interno) para renderizar dentro do card
//E className (classes CSS adicionais opcionais) para personalizar o estilo do componente

export default function CanvasCard({ children, className }: CanvasCardProps) {
  return (
    <div
      className={`rounded-xl bg-card text-card-foreground shadow-md border p-6 transition-all duration-300 hover:shadow-lg ${className || ""}`}
    >
      {children}
    </div>
  );
}

//define o componente funcional CanvasCard
//recebe as props children e className
//retorna um div estilizado com classes CSS para aparência de card
//permite importar com qualquer nome em outros arquivos
//renderiza o conteúdo passado como children dentro do div
//aplica classes CSS adicionais se className for fornecido
//inclui efeitos de transição e sombra ao passar o mouse sobre o card
//usa classes utilitárias (provavelmente do Tailwind CSS) para estilização