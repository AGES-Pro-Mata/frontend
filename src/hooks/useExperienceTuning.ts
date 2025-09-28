import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { ExperienceTuningData } from "@/types/experience";

interface UseExperienceTuningOptions {
  experienceId?: string;
  persist?: boolean;
  onLoad?: (data: ExperienceTuningData) => void;
  onSave?: (data: ExperienceTuningData) => void;
}

export function useExperienceTuning({
  experienceId,
  persist = true,
  onLoad,
  onSave,
}: UseExperienceTuningOptions) {
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [men, setMen] = useState<string>("");
  const [women, setWomen] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [savedRange, setSavedRange] = useState<DateRange | undefined>();
  const [savedMen, setSavedMen] = useState<number>(0);
  const [savedWomen, setSavedWomen] = useState<number>(0);

  const storageKey = experienceId && persist ? `experience_tuning_${experienceId}` : undefined;

  const load = useCallback(() => {
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      const data: ExperienceTuningData = JSON.parse(raw);
      if (data.from && data.to) {
        const fromDate = new Date(data.from);
        const toDate = new Date(data.to);
        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          setRange({ from: fromDate, to: toDate });
          setSavedRange({ from: fromDate, to: toDate });
          setMen(String(data.men ?? 0));
          setWomen(String(data.women ?? 0));
          setSavedMen(data.men ?? 0);
          setSavedWomen(data.women ?? 0);
          setSaved(true);
          onLoad?.(data);
        }
      }
    } catch (e) {
      console.warn("Unable to load experience tuning data", e);
    }
  }, [onLoad, storageKey]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(() => {
    if (!range.from || !range.to) return;
    const menNum = men === "" ? 0 : Number(men);
    const womenNum = women === "" ? 0 : Number(women);
    const payload: ExperienceTuningData = {
      experienceId,
      men: menNum,
      women: womenNum,
      from: range.from.toISOString(),
      to: range.to.toISOString(),
      savedAt: new Date().toISOString(),
    };
    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setSavedRange(range);
        setSaved(true);
        setSavedMen(menNum);
        setSavedWomen(womenNum);
      } catch (e) {
        console.warn("Unable to persist experience tuning data", e);
      }
    } else {
      setSavedRange(range);
      setSaved(true);
      setSavedMen(menNum);
      setSavedWomen(womenNum);
    }
    onSave?.(payload);
    return payload;
  }, [experienceId, men, range, storageKey, women, onSave]);

  const reset = useCallback(() => {
    setRange({ from: undefined, to: undefined });
    setMen("");
    setWomen("");
    setSaved(false);
    setSavedRange(undefined);
  setSavedMen(0);
  setSavedWomen(0);
    if (storageKey) {
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn("Unable to clear experience tuning data", e);
      }
    }
  }, [storageKey]);

  return {
    range,
    setRange,
    men,
    setMen,
    women,
    setWomen,
    saved,
    savedRange,
  savedMen,
  savedWomen,
    save,
    reset,
  };
}
