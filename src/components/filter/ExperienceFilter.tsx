import { useFilters } from "@/hooks/filters/filters";
import type { TExperienceFilters } from "@/entities/experience-filter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar22 } from "@/components/ui/calendarFilter";

const experienceTypes = ["Quartos", "Eventos", "Laboratórios", "Trilhas"];

export function ExperienceFilter() {
  const { filters, setFilter } = useFilters<TExperienceFilters>({
    key: "get-experiences",
    initialFilters: {
      limit: 10,
      page: 0,
      type: "Laboratórios",
    },
  });

      return (
    <div className="p-4 bg-white rounded-lg shadow">
      {/* Data de Entrada e Saída */}
      <div className="flex gap-4 mb-4 justify-center">
        <div className="flex flex-col">
          <Label className="px-1 mb-3">Data de Entrada</Label>
          <Calendar22
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(date) => setFilter("startDate", date.toISOString().split("T")[0])}
            placeholder="Entrada"
            className="border rounded px-2 py-1"
          />
        </div>
        <div className="flex flex-col">
          <Label className="px-1 mb-3">Data de Saída</Label>
          <Calendar22
            value={filters.startDate ? new Date(filters.startDate) : undefined}
            onChange={(date) => setFilter("endDate", date.toISOString().split("T")[0])}
            placeholder="Saída"
            className="border rounded px-2 py-1"
          />
        </div>
      </div>
  
      {/* Botões de Tipo de Experiência */}
      <div className="flex gap-8 mb-4 justify-center bg-[#F4F2EF] rounded-full w-full max-w-lvh mx-auto">
        {experienceTypes.map((type) => (
          <Button
            key={type}
            className={`px-4 py-2 rounded-full font-semibold shadow-none transition-none ${
              filters.type === type ? "bg-[#E1DBD3]" : "bg-[#F4F2EF]"
            }`}
            onClick={() => setFilter("type", type)}
            variant="ghost"
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Barra de Busca */}
      <div className="mb-4 flex justify-center mt-4">
        <Input
          type="text"
          placeholder="Buscar..."
          value={filters.search || ""}
          onChange={(e) => setFilter("search", e.target.value)}
          className="border rounded px-2 py-1 justify-center max-w-lvh"
        />
      </div>
    </div>
  );
}

