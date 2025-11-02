import type { TExperienceFilters } from "@/entities/experience-filter";
import {
  type FilterOption,
  FilterPanel,
} from "@/components/filter/FilterPanel";
import { ExperienceCategory } from "@/types/experience";

const experienceTypeOptions: FilterOption[] = [
  {
    value: ExperienceCategory.HOSPEDAGEM,
    labelKey: "reserveFilter.experienceTypes.rooms",
  },
  {
    value: ExperienceCategory.EVENTO,
    labelKey: "reserveFilter.experienceTypes.events",
  },
  {
    value: ExperienceCategory.LABORATORIO,
    labelKey: "reserveFilter.experienceTypes.labs",
  },
  {
    value: ExperienceCategory.TRILHA,
    labelKey: "reserveFilter.experienceTypes.trails",
  },
];

export function ExperienceFilter({ className }: { className?: string } = {}) {
  return (
    <FilterPanel<TExperienceFilters>
      filtersKey="get-experiences"
      initialFilters={{
        category: ExperienceCategory.HOSPEDAGEM,
        startDate: undefined,
        endDate: undefined,
        search: undefined,
        page: 0,
      }}
      toggleKey="category"
      options={experienceTypeOptions}
      className={className}
    />
  );
}
