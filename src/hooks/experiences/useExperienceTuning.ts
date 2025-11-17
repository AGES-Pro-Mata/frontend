import { useCallback, useEffect, useRef, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { ExperienceTuningData } from "@/types/experience";

interface UseExperienceTuningOptions {
  experienceId?: string;
  persist?: boolean;
  initialData?: ExperienceTuningData | null;
  onLoad?: (data: ExperienceTuningData) => void;
  onSave?: (data: ExperienceTuningData) => void;
}

const toSafeNumber = (value: number | string | null | undefined): number => {
  const numeric = typeof value === "number" ? value : Number(value ?? 0);

  if (!Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }

  return numeric;
};

const toDateOrNull = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const isExperienceTuningData = (value: unknown): value is ExperienceTuningData => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const data = value as Partial<ExperienceTuningData>;

  return typeof data.from === "string" && typeof data.to === "string";
};

export function useExperienceTuning({
  experienceId,
  persist = true,
  initialData,
  onLoad,
  onSave,
}: UseExperienceTuningOptions) {
  const [range, setRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [men, setMen] = useState<string>("");
  const [women, setWomen] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [savedRange, setSavedRange] = useState<DateRange | undefined>();
  const [savedMen, setSavedMen] = useState(0);
  const [savedWomen, setSavedWomen] = useState(0);

  const storageKey = experienceId && persist ? `experience_tuning_${experienceId}` : undefined;
  const previousInitialRef = useRef<ExperienceTuningData | null>(null);

  const applyData = useCallback(
    (data: ExperienceTuningData | null | undefined, markSaved: boolean) => {
      if (!data) return;

      const fromDate = toDateOrNull(data.from);
      const toDate = toDateOrNull(data.to);

      if (!fromDate || !toDate) {
        return;
      }

      const menValue = toSafeNumber(data.men);
      const womenValue = toSafeNumber(data.women);

      const normalizedRange: DateRange = { from: fromDate, to: toDate };

      setRange(normalizedRange);
      setSavedRange(normalizedRange);
      setMen(String(menValue));
      setWomen(String(womenValue));
      setSavedMen(menValue);
      setSavedWomen(womenValue);
      setSaved(markSaved);
    },
    []
  );

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
      } catch {
        /* noop: storage may be unavailable */
      }
    }
  }, [storageKey]);

  const load = useCallback(() => {
    if (!storageKey) return;

    try {
      const raw = localStorage.getItem(storageKey);

      if (!raw) return;
      const parsed: unknown = JSON.parse(raw);

      if (!isExperienceTuningData(parsed)) return;

      applyData(parsed, true);
      onLoad?.(parsed);
    } catch {
      /* noop: storage access or parsing failed */
    }
  }, [applyData, onLoad, storageKey]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (initialData) {
      applyData(initialData, true);
      previousInitialRef.current = initialData;
    } else if (previousInitialRef.current) {
      reset();
      previousInitialRef.current = null;
    }
  }, [initialData, applyData, reset]);

  const save = useCallback(() => {
    if (!range.from || !range.to) return;

    const menValue = men === "" ? 0 : toSafeNumber(men);
    const womenValue = women === "" ? 0 : toSafeNumber(women);

    const payload: ExperienceTuningData = {
      experienceId,
      men: menValue,
      women: womenValue,
      from: range.from.toISOString(),
      to: range.to.toISOString(),
      savedAt: new Date().toISOString(),
    };

    if (storageKey) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(payload));
      } catch {
        /* noop: best effort storage */
      }
    }

    setSavedRange(range);
    setSaved(true);
    setSavedMen(menValue);
    setSavedWomen(womenValue);

    onSave?.(payload);

    return payload;
  }, [experienceId, men, onSave, range, storageKey, women]);

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
