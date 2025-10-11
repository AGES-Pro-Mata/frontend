import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ReserveInfo } from "@/components/layouts/reserve/ReserveInfo";
import type {
  ReserveParticipant,
  ReserveSummaryExperience,
} from "@/types/reserve";

export const Route = createFileRoute("/admin/requests/reservation-info/")({
  component: ReserveInfoPage,
});

const mockPeople: ReserveParticipant[] = [
  {
    id: "1",
    name: "Usuário 1",
    phone: "(51) 99999-9999",
    birthDate: "2000-10-11",
    cpf: "123.456.789-00",
    gender: "MALE",
  },
  {
    id: "2",
    name: "Usuário 2",
    phone: "(51) 99999-9999",
    birthDate: "1999-02-20",
    cpf: "123.456.789-00",
    gender: "FEMALE",
  },
  {
    id: "3",
    name: "Usuário 3",
    phone: "(51) 99999-9999",
    birthDate: "1995-07-03",
    cpf: "123.456.789-00",
    gender: "MALE",
  },
];

const mockExperiences: ReserveSummaryExperience[] = [
  {
    title: "Experiência X",
    startDate: "2025-08-11",
    endDate: "2025-08-15",
    price: 356.9,
    peopleCount: 10,
    imageUrl: "/public/mock/landscape-2.webp",
  },
  {
    title: "Experiência Y",
    startDate: "2025-08-18",
    endDate: "2025-08-20",
    price: 420,
    peopleCount: 8,
    imageUrl: "/public/mock/landscape-4.webp",
  },
  {
    title: "Experiência Z",
    startDate: "2025-09-01",
    endDate: "2025-09-03",
    price: 280,
    peopleCount: 6,
    imageUrl: "/public/mock/landscape-5.jpg",
  },
];

function ReserveInfoPage() {
  const navigate = useNavigate();

  return (
    <ReserveInfo
      participants={mockPeople}
      experiences={mockExperiences}
      notes="Sem observações"
      onBack={() => navigate({ to: "/" })}
    />
  );
}
