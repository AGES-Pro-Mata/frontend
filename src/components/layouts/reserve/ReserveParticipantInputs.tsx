import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar as CalendarIcon } from "lucide-react";

import { TextInput } from "@/components/input/textInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { cn, digitsOnly, maskCpf, maskPhone } from "@/lib/utils";
import type {
  ReserveParticipantDraft,
  ReserveParticipantGender,
} from "@/types/reserve";

export type ReserveParticipantInputsProps = {
  person: ReserveParticipantDraft;
  readOnly?: boolean;
  disabled?: boolean;
  onFieldChange?: <K extends keyof ReserveParticipantDraft>(
    field: K,
    value: ReserveParticipantDraft[K]
  ) => void;
  className?: string;
};

function maskDateBR(v: string) {
  const d = digitsOnly(v).slice(0, 8);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 4);
  const p3 = d.slice(4, 8);
  if (d.length <= 2) return p1;
  if (d.length <= 4) return `${p1}/${p2}`;
  return `${p1}/${p2}/${p3}`;
}

function toIsoFromBR(v: string) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec((v || "").trim());
  if (!m) return "";
  const [, dd, mm, yyyy] = m;
  const y = Number(yyyy),
    mo = Number(mm),
    d = Number(dd);
  if (y < 1900 || y > new Date().getFullYear()) return "";
  if (mo < 1 || mo > 12) return "";
  const lastDay = new Date(y, mo, 0).getDate();
  if (d < 1 || d > lastDay) return "";
  return `${yyyy}-${mm}-${dd}`;
}

function toBRForDisplay(v: string) {
  const iso = (v || "").trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${d}/${m}/${y}`;
  }
  return maskDateBR(v || "");
}

function isoToDate(iso: string): Date | undefined {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso || "").trim());
  if (!m) return undefined;
  const [, y, mo, d] = m;
  const dt = new Date(Number(y), Number(mo) - 1, Number(d));
  return isNaN(dt.getTime()) ? undefined : dt;
}

function dateToIso(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ReserveParticipantInputs({
  person,
  readOnly = false,
  disabled = false,
  onFieldChange,
  className,
}: ReserveParticipantInputsProps) {
  const { t } = useTranslation();
  const [calendarOpen, setCalendarOpen] = useState(false);

  const genderOptions = useMemo(
    () => ({
      FEMALE: t("reserveFlow.peopleStep.genderOptions.female"),
      MALE: t("reserveFlow.peopleStep.genderOptions.male"),
      OTHER: t("reserveFlow.peopleStep.genderOptions.other"),
      NOT_INFORMED: t("reserveFlow.peopleStep.genderOptions.notInformed"),
    }),
    [t]
  ) as Record<ReserveParticipantGender, string>;

  const handleChange = <K extends keyof ReserveParticipantDraft>(
    field: K,
    value: ReserveParticipantDraft[K]
  ) => {
    if (onFieldChange) onFieldChange(field, value);
  };

  const handlePhoneChange = (value: string) => {
    const digits = digitsOnly(value).slice(0, 11);

    handleChange("phone", maskPhone(digits));
  };

  const handleCpfChange = (value: string) => {
    const digits = digitsOnly(value).slice(0, 11);

    handleChange("cpf", maskCpf(digits));
  };

  const isReadOnly = readOnly === true;
  const isSelectDisabled = disabled || isReadOnly;
  const dateForCalendar = isoToDate(person.birthDate || "");

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5",
        className
      )}
    >
      <TextInput
        label={t("reserveFlow.peopleStep.fields.name.label")}
        required
        placeholder={t("reserveFlow.peopleStep.fields.name.placeholder")}
        value={person.name}
        onChange={(e) => handleChange("name", e.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
        )}
      />

      <TextInput
        label={t("reserveFlow.peopleStep.fields.phone.label")}
        required
        placeholder={t("reserveFlow.peopleStep.fields.phone.placeholder")}
        value={person.phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
        )}
      />

      <div className="flex flex-col xl:min-w-[12rem]">
        <Label className="flex items-center gap-1 text-sm font-medium text-foreground">
          <span>{t("reserveFlow.peopleStep.fields.birthDate.label")}</span>
          <span>*</span>
        </Label>

        <div className="relative mt-1">
          <TextInput
            required
            type="text"
            inputMode="numeric"
            maxLength={10}
            placeholder="DD/MM/AAAA"
            value={toBRForDisplay(person.birthDate || "")}
            onChange={(e) => {
              const masked = maskDateBR(e.target.value);
              handleChange("birthDate", masked as any);
            }}
            onBlur={(e) => {
              const iso = toIsoFromBR(e.target.value);
              if (iso) handleChange("birthDate", iso as any);
            }}
            disabled={disabled}
            readOnly={isReadOnly}
            tabIndex={isReadOnly ? -1 : undefined}
            className={cn(
              "pr-12",
              "pr-10",
              "w-full xl:min-w-[13.3rem] pr-10",
              isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
            )}
          />

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                    "absolute inset-y-0 right-0 z-10 w-10",
-                  "inline-flex items-center justify-center rounded-r-md",
+                  "absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8",
+                  "inline-flex items-center justify-center rounded-md",
                   "bg-transparent",
                   "text-foreground/80",
                   "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                disabled={disabled || isReadOnly}
                aria-label={t("reserveFlow.peopleStep.fields.birthDate.label")}
              >
                <CalendarIcon className="h-4 w-4 pointer-events-none" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end" sideOffset={8}>
              <Calendar
                mode="single"
                selected={dateForCalendar}
                onSelect={(date) => {
                  if (date) {
                    const iso = dateToIso(date);
                    handleChange("birthDate", iso as any);
                  }
                  setCalendarOpen(false);
                }}
                fromYear={1900}
                toYear={new Date().getFullYear()}
                captionLayout="dropdown-buttons"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <TextInput
        label={t("reserveFlow.peopleStep.fields.cpf.label")}
        required
        placeholder={t("reserveFlow.peopleStep.fields.cpf.placeholder")}
        value={person.cpf}
        onChange={(e) => handleCpfChange(e.target.value)}
        disabled={disabled}
        readOnly={isReadOnly}
        tabIndex={isReadOnly ? -1 : undefined}
        className={cn(
          "xl:min-w-[12rem]",
          isReadOnly ? "pointer-events-none text-main-dark-green" : undefined
        )}
      />

      {isReadOnly ? (
        <TextInput
          label={t("reserveFlow.peopleStep.fields.gender.label")}
          required
          value={
            person.gender && person.gender in genderOptions
              ? genderOptions[person.gender]
              : ""
          }
          readOnly
          tabIndex={-1}
          className={cn(
            "xl:min-w-[12rem] pointer-events-none text-main-dark-green"
          )}
        />
      ) : (
        <div className="flex flex-col gap-1 xl:min-w-[12rem]">
          <Label className="flex items-center gap-1 text-sm font-medium text-foreground">
            <span>{t("reserveFlow.peopleStep.fields.gender.label")}</span>
            <span>*</span>
          </Label>
          <Select
            value={person.gender}
            onValueChange={(value) =>
              handleChange("gender", value as ReserveParticipantGender | "")
            }
            disabled={isSelectDisabled}
          >
            <SelectTrigger
              size="default"
              className={cn(
                "h-12 border border-dark-gray/40 bg-soft-white text-sm",
                isSelectDisabled ? "opacity-80" : ""
              )}
            >
              <SelectValue
                placeholder={t(
                  "reserveFlow.peopleStep.fields.gender.placeholder"
                )}
              />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {Object.entries(genderOptions).map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value as ReserveParticipantGender}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
