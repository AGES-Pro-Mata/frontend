import type { TExperienceFilters } from "@/entities/experience-filter";
import { type FilterOption, FilterPanel } from "@/components/filter/FilterPanel";

const experienceTypeOptions: FilterOption[] = [
  { value: "rooms", labelKey: "reserveFilter.experienceTypes.rooms" },
  { value: "events", labelKey: "reserveFilter.experienceTypes.events" },
  { value: "labs", labelKey: "reserveFilter.experienceTypes.labs" },
  { value: "trails", labelKey: "reserveFilter.experienceTypes.trails" },
];

export function ExperienceFilter({ className }: { className?: string } = {}) {
  return (
    <FilterPanel<TExperienceFilters>
      filtersKey="get-experiences"
      initialFilters={{
        limit: 10,
        page: 0,
        type: "rooms",
      }}
      toggleKey="type"
      options={experienceTypeOptions}
      className={className}
    />
  );
}
