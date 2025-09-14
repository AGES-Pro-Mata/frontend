import { useEffect, useState } from "react";

const experienceTypes = ["Quartos", "Eventos", "Laboratórios", "Trilhas"];

type Experience = {
  name: string;
  description: string;
  type: string;
  date: string;
};

interface ExperienceFilterProps {
  experiences: Experience[];
  onFilter: (filtered: Experience[]) => void;
}

export function ExperienceFilter({ experiences, onFilter }: ExperienceFilterProps) {
  const [selectedType, setSelectedType] = useState("Laboratórios");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const filtered = experiences
      .filter(exp => exp.type === selectedType)
      .filter(exp => exp.name.toLowerCase().includes(search.toLowerCase()) || exp.description.toLowerCase().includes(search.toLowerCase()))
      .filter(exp => {
        if (!startDate && !endDate) return true;
        const expDate = new Date(exp.date);
        return (!startDate || expDate >= new Date(startDate)) && (!endDate || expDate <= new Date(endDate));
      });
    onFilter(filtered);
  }, [selectedType, search, startDate, endDate, experiences]);

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex gap-4 mb-4">
        <div>
          <label>Data de Entrada</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
        <div>
          <label>Data de Saída</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded px-2 py-1" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {experienceTypes.map(type => (
          <button
            key={type}
            className={`px-4 py-2 rounded-full ${selectedType === type ? "bg-neutral-200" : "bg-neutral-100"}`}
            onClick={() => setSelectedType(type)}
          >
            {type}
          </button>
        ))}
      </div>
      <input
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
}