import { useFilters } from "@/hooks/filters/filters";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar22 } from "@/components/filter/calendarFilter";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export type FilterWithDateRange = {
  startDate?: string;
  endDate?: string;
  search?: string;
};

export type FilterOption = {
  value: string;
  labelKey: string;
};

export type FilterTranslations = {
  arrivalDateLabelKey: string;
  arrivalDatePlaceholderKey: string;
  departureDateLabelKey: string;
  departureDatePlaceholderKey: string;
  searchPlaceholderKey: string;
  searchAriaLabelKey: string;
};

const DEFAULT_TRANSLATIONS: FilterTranslations = {
  arrivalDateLabelKey: "reserveFilter.arrivalDateLabel",
  arrivalDatePlaceholderKey: "reserveFilter.arrivalDatePlaceholder",
  departureDateLabelKey: "reserveFilter.departureDateLabel",
  departureDatePlaceholderKey: "reserveFilter.departureDatePlaceholder",
  searchPlaceholderKey: "reserveFilter.searchPlaceholder",
  searchAriaLabelKey: "reserveFilter.searchAriaLabel",
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const displayDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const parseDate = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

export type FilterPanelProps<F extends FilterWithDateRange> = {
  filtersKey: string;
  initialFilters: Partial<F>;
  toggleKey: keyof F;
  options: FilterOption[];
  translations?: Partial<FilterTranslations>;
  className?: string;
};

export function FilterPanel<F extends FilterWithDateRange>({
  filtersKey,
  initialFilters,
  toggleKey,
  options,
  translations,
  className,
}: FilterPanelProps<F>) {
  const { t } = useTranslation();
  const translationKeys = { ...DEFAULT_TRANSLATIONS, ...translations };

  const { filters, setFilters } = useFilters<F>({
    key: filtersKey,
    initialFilters,
  });

  const startDateValue = parseDate(filters.startDate ?? undefined);
  const endDateValue = parseDate(filters.endDate ?? undefined);

  const handleStartDateChange = (date?: Date) => {
    if (!date) {
      setFilters({ startDate: undefined, endDate: undefined } as Partial<F>);

      return;
    }

    const formatted = formatDate(date);

    setFilters({ startDate: formatted } as Partial<F>);

    if (endDateValue && date > endDateValue) {
      setFilters({ endDate: undefined } as Partial<F>);
    }
  };

  const handleEndDateChange = (date?: Date) => {
    if (!date) {
      setFilters({ endDate: undefined } as Partial<F>);

      return;
    }

    if (startDateValue && date < startDateValue) {
      return;
    }

    const formatted = formatDate(date);

    setFilters({ endDate: formatted } as Partial<F>);
  };

  const selectedValue = filters[toggleKey];
  const searchValue =
    typeof filters.search === "string" ? filters.search : "";

  return (
    <section
      className={cn(
        "mx-auto w-full max-w-[1080px] rounded-[48px] border border-card/40 bg-card/20 px-6 py-8 shadow-[0_45px_120px_rgba(46,54,29,0.08)] md:px-12 md:py-12",
        className
      )}
    >
      <div className="flex flex-col gap-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Label className="text-xs font-semibold uppercase tracking-[0.3em] text-on-banner-text/70">
              {t(translationKeys.arrivalDateLabelKey)}
            </Label>
            <Calendar22
              value={startDateValue}
              onChange={handleStartDateChange}
              placeholder={t(translationKeys.arrivalDatePlaceholderKey)}
              disabled={endDateValue ? { after: endDateValue } : undefined}
              displayFormat={displayDate}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label className="text-xs font-semibold uppercase tracking-[0.3em] text-on-banner-text/70">
              {t(translationKeys.departureDateLabelKey)}
            </Label>
            <Calendar22
              value={endDateValue}
              onChange={handleEndDateChange}
              placeholder={t(translationKeys.departureDatePlaceholderKey)}
              disabled={startDateValue ? { before: startDateValue } : undefined}
              displayFormat={displayDate}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ToggleGroup
            type="single"
            value={selectedValue ? String(selectedValue) : undefined}
            onValueChange={(value: string) => {
              if (!value) {
                return;
              }

              const typedValue = value as F[typeof toggleKey];

              setFilters({ [toggleKey]: typedValue } as Partial<F>);
            }}
            className="flex flex-wrap items-center justify-center gap-4 md:justify-start"
          >
            {options.map(({ value, labelKey }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className={cn(
                  "group flex h-12 flex-none cursor-pointer items-center justify-center !rounded-full border border-card/70 bg-white px-8 text-sm font-semibold tracking-[0.02em] text-on-banner-text shadow-none transition-none first:!rounded-l-full last:!rounded-r-full",
                  "hover:bg-card/20 hover:text-on-banner-text",
                  "data-[state=on]:border-transparent data-[state=on]:bg-main-dark-green data-[state=on]:text-white data-[state=on]:shadow-[0_24px_48px_rgba(46,54,29,0.25)]"
                )}
              >
                {t(labelKey)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="relative w-full md:max-w-[380px]">
            <Search className="pointer-events-none absolute left-6 top-1/2 size-5 -translate-y-1/2 text-on-banner-text/40" />
            <Input
              type="text"
              placeholder={t(translationKeys.searchPlaceholderKey)}
              value={searchValue}
              onChange={(event) =>
                setFilters({ search: event.target.value } as Partial<F>)
              }
              aria-label={t(translationKeys.searchAriaLabelKey)}
              className="h-14 rounded-full border border-card/60 bg-white pl-14 pr-6 text-base font-medium text-on-banner-text placeholder:text-on-banner-text/50 shadow-[0_45px_120px_rgba(46,54,29,0.08)] focus-visible:border-main-dark-green focus-visible:ring-main-dark-green/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
