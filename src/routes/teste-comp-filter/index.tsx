import { useState } from 'react';
import { ExperienceFilter } from '@/components/filter/ExperienceFilter';
import { createFileRoute } from '@tanstack/react-router';

type Experience = {
  name: string;
  description: string;
  type: string;
  date: string;
};

const experiences: Experience[] = [
  { name: "Quarto 1", description: "Descrição do Quarto 1", type: "Quartos", date: "2025-09-10" },
  // ...adicione mais experiências para teste
];


function TesteCompFilter() {
    const [filtered, setFiltered] = useState<Experience[]>(experiences);

    return (
        <div>
            <ExperienceFilter experiences={experiences} onFilter={setFiltered} />
            <ul>
                {filtered.map(exp => (
                    <li key={exp.name}>{exp.name} - {exp.description}</li>
                ))}
            </ul>
        </div>
    );
}

export const Route = createFileRoute('/teste-comp-filter/')({
    component: TesteCompFilter,
});