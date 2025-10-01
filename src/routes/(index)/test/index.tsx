import { CartItem } from "@/components/cards";
import { ExperienceCategoryCard, type ExperienceDTO } from "@/types/experiences";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/(index)/test/')({
  component: TestPage,
})

export default function TestPage() {
  const experiences: ExperienceDTO[] = [
    {
      id: "t1",
      name: "Trilha do Vale Encantado",
      category: ExperienceCategoryCard.TRAIL,
      capacity: 12,
      startDate: null,
      endDate: null,
      price: 150,
      weekDays: ["SAT", "SUN"],
      durationMinutes: 240,
      trailDifficulty: "MEDIUM",
      trailLength: 7.2,
      image: {
        url: "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1400&auto=format&fit=crop",
      },
      imageId: null,
    },
    {
      id: "r1",
      name: "Quarto Família",
      category: ExperienceCategoryCard.ROOM,
      capacity: 4,
      startDate: null,
      endDate: null,
      price: 320,
      weekDays: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
      durationMinutes: null,
      trailDifficulty: null,
      trailLength: null,
      image: {
        url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400&auto=format&fit=crop",
      },
      imageId: null,
    },
    {
      id: "e1",
      name: "Observação de Estrelas",
      category: ExperienceCategoryCard.EVENT,
      capacity: 20,
      startDate: "2025-10-12T20:00:00.000Z",
      endDate: "2025-10-12T23:00:00.000Z",
      price: 80,
      weekDays: null,
      durationMinutes: null,
      trailDifficulty: null,
      trailLength: null,
      image: {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop",
      },
      imageId: null,
    },
  ];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Playground (mock)</h1>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <CartItem key={exp.id} experience={exp} />
        ))}
      </div>
    </div>
  );
}
