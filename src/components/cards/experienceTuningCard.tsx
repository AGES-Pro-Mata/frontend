"use client";

import { useState } from "react";
import { Button } from "@/components/buttons/defaultButton";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CanvasCard from "@/components/cards/canvasCard";
import { CalendarIcon, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useExperienceTuning } from "@/hooks/useExperienceTuning";
import type { ExperienceTuningData } from "@/types/experience";

type ExperienceCardProps = {
  title: string;
  price: number;
  period: { start: Date; end: Date };
  imageUrl: string;
  experienceId?: string;
  persist?: boolean;
  onSave?: (data: ExperienceTuningData) => void;
};

export default function ExperienceCard({
  title,
  price,
  period,
  imageUrl,
  experienceId,
  persist = true,
  onSave,
}: ExperienceCardProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const {
    range,
    setRange,
    men,
    setMen,
    women,
    setWomen,
    saved,
    savedRange,
    save,
    savedMen,
    savedWomen,
  } = useExperienceTuning({ experienceId, persist, onSave });

  const fmt = (d: Date) => d.toLocaleDateString("pt-BR");

  // Live input values (men, women) are only reflected in summary after save.

  const handleSave = () => {
    if (range?.from && range?.to) {
      save();
      setOpen(false);
    }
  };

  const handleToggle = () => {
    // If closing (was open), revert unsaved edits
    setOpen((prev) => {
      if (prev) {
        // Revert range & people to last saved snapshot
        if (savedRange?.from && savedRange?.to) {
          setRange({ from: savedRange.from, to: savedRange.to });
        } else {
          setRange({ from: undefined, to: undefined });
        }
        // Revert people counts
        setMen(savedMen.toString());
        setWomen(savedWomen.toString());
      }
      return !prev;
    });
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const raw = e.target.value.replace(/,/g, "");
    if (raw === "") {
      setter("");
      return;
    }
    if (!/^\d+$/.test(raw)) return;
    const clamped = Math.min(Number(raw), 1000).toString();
    setter(clamped);
  };

  const handleDayClick = (day: Date) => {
    if (range?.from && range?.to) {
      setRange({ from: day, to: undefined });
      return;
    }
    if (range?.from && !range?.to) {
      if (day.getTime() === range.from.getTime()) {
        setRange({ from: day, to: day });
        return;
      }
      if (day > range.from) {
        setRange({ from: range.from, to: day });
      } else {
        setRange({ from: day, to: undefined });
      }
      return;
    }
    if (!range?.from) {
      setRange({ from: day, to: undefined });
    }
  };

  return (
    <CanvasCard className="w-full max-w-3xl mx-auto bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
      {/* image */}
      <div className="w-full overflow-hidden h-40 md:h-56 lg:h-64 xl:h-72 rounded-t-xl">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover block" />
      </div>

      {/* header */}
      <div className="w-full px-5 pt-4 pb-5 text-main-dark-green flex flex-col gap-3">
        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-3">
          <h2 className="font-bold text-sm md:text-base w-full md:w-auto">{title}</h2>
          <span className="inline-flex items-center justify-center text-xs text-main-dark-green bg-card rounded-full font-bold shadow-inner px-3 py-1 shrink-0">
            Pacote
          </span>
          <div className="flex items-center justify-start rounded-full bg-card shadow-sm gap-2 h-8 md:h-9 px-3 shrink-0">
            <span className="text-xs md:text-sm font-semibold text-main-dark-green">R$ {price.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-start rounded-full bg-card shadow-sm gap-2 px-3 py-1 w-full md:w-auto md:flex-none flex-1 min-w-0 order-last md:order-none">
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-main-dark-green text-white shrink-0">
              <CalendarIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs md:text-sm font-semibold text-main-dark-green whitespace-normal break-words leading-tight">
              {t("experienceCard.dateRange", { from: fmt(period.start), to: fmt(period.end) })}
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-2 mb-1">
          <Button
            onClick={handleToggle}
            className="bg-main-dark-green text-white rounded-full px-4 py-1.5 text-sm shadow-md hover:bg-main-dark-green"
            label={
              open
                ? t("common.cancel")
                : saved
                ? t("experienceCard.editInfo")
                : t("experienceCard.selectDateAndPeople")
            }
          />
        </div>

        {saved && savedRange?.from && savedRange?.to && (
          <div className="flex justify-start gap-3">
            <span className="text-xs md:text-sm text-main-dark-green">
              {t("experienceCard.men")}: <span className="font-bold">{savedMen}</span>
            </span>
            <span className="text-xs md:text-sm text-main-dark-green">
              {t("experienceCard.women")}: <span className="font-bold">{savedWomen}</span>
            </span>
            <span className="text-xs md:text-sm text-main-dark-green">
              {t("experienceCard.selectedDate")}: {" "}
              <span className="font-bold">
                {t("experienceCard.dateRange", {
                  from: fmt(savedRange.from),
                  to: fmt(savedRange.to),
                })}
              </span>
            </span>
          </div>
        )}
      </div>

      {open && (
        <div className="p-3 md:p-4 bg-banner rounded-lg shadow-md flex flex-col gap-4 text-main-dark-green my-3 mx-2 md:mx-3 max-w-none">
          <h3 className="text-base font-bold">{t("experienceCard.chooseDate")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 items-start">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-7 px-3 w-full md:max-w-xs">
                <div className="w-5 h-5 flex items-center justify-center rounded-full bg-main-dark-green text-white">
                  <CalendarIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold text-main-dark-green leading-none">
                  {range?.from && range?.to
                    ? t("experienceCard.dateRange", { from: fmt(range.from), to: fmt(range.to) })
                    : t("experienceCard.selectPeriodOnCalendar")}
                </span>
              </div>
              <div className="bg-soft-white rounded-lg shadow-sm p-3 w-full md:max-w-xs">
                <Calendar
                  mode="range"
                  selected={range}
                  onSelect={(value) => {
                    if (!value) {
                      setRange({ from: undefined, to: undefined });
                      return;
                    }
                    const { from, to } = value;
                    if (from && to && from.getTime() === to.getTime()) {
                      if (range.from && !range.to && range.from.getTime() === from.getTime()) {
                        setRange({ from, to });
                        return;
                      }
                      setRange({ from, to: undefined });
                      return;
                    }
                    setRange(value);
                  }}
                  onDayClick={handleDayClick}
                  defaultMonth={range.from ?? period.start}
                  disabled={[{ before: period.start }, { after: period.end }]}
                  style={{ ["--rdp-cell-size" as any]: "1.75rem" }}
                  classNames={{
                    root: "m-0",
                    day_selected: "bg-main-dark-green text-white",
                    day_range_start: "bg-main-dark-green text-white rounded-l-full",
                    day_range_end: "bg-main-dark-green text-white rounded-r-full",
                    day_range_middle: "bg-main-dark-green text-white",
                    day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-3 w-full">
              <div className="w-full md:max-w-xs">
                <div className="flex items-center justify-start rounded-full bg-card shadow-md gap-2 h-7 px-3 w-full">
                  <div className="w-5 h-5 flex items-center justify-center rounded-full bg-main-dark-green text-white">
                    <Users className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-main-dark-green leading-none">
                    {t("experienceCard.selectAmountOfPeople")}
                  </span>
                </div>
              </div>
              <div className="w-full md:max-w-xs">
                <Label className="mb-1 block text-sm">{t("experienceCard.malePeople")}</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="0"
                  value={men}
                  onChange={(e) => handleNumberInput(e, setMen)}
                  className="border border-main-dark-green rounded-md w-full h-8 text-sm"
                  maxLength={4}
                />
              </div>
              <div className="w-full md:max-w-xs">
                <Label className="mb-1 block text-sm">{t("experienceCard.femalePeople")}</Label>
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="0"
                  value={women}
                  onChange={(e) => handleNumberInput(e, setWomen)}
                  className="border border-main-dark-green rounded-md w-full h-8 text-sm"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              className="mt-2 bg-main-dark-green text-white rounded-full px-4 py-1.5 text-sm shadow-md hover:bg-contrast-green"
              onClick={handleSave}
              disabled={!range?.from || !range?.to}
              label={t("common.save")}
            />
          </div>
        </div>
      )}
    </CanvasCard>
  );
}