import type { TFunction } from "i18next";
import { ExperienceCategory, ExperienceCategoryCard } from "@/types/experience";

const baseMap: Record<string, string> = {
  trail: "trail",
  trails: "trail",
  trilha: "trail",
  event: "event",
  events: "event",
  evento: "event",
  room: "room",
  rooms: "room",
  hospedagem: "room",
  hotel: "room",
  lab: "lab",
  laboratories: "lab",
  labs: "lab",
  laboratorio: "lab",
  laboratory: "lab",
};

baseMap[ExperienceCategory.TRILHA.toLowerCase()] = "trail";
baseMap[ExperienceCategory.EVENTO.toLowerCase()] = "event";
baseMap[ExperienceCategory.HOSPEDAGEM.toLowerCase()] = "room";
baseMap[ExperienceCategory.LABORATORIO.toLowerCase()] = "lab";
baseMap[ExperienceCategory.TRILHA] = "trail";
baseMap[ExperienceCategory.EVENTO] = "event";
baseMap[ExperienceCategory.HOSPEDAGEM] = "room";
baseMap[ExperienceCategory.LABORATORIO] = "lab";
baseMap[ExperienceCategoryCard.TRAIL.toLowerCase()] = "trail";
baseMap[ExperienceCategoryCard.EVENT.toLowerCase()] = "event";
baseMap[ExperienceCategoryCard.ROOM.toLowerCase()] = "room";
baseMap[ExperienceCategoryCard.LAB.toLowerCase()] = "lab";
baseMap[ExperienceCategoryCard.TRAIL] = "trail";
baseMap[ExperienceCategoryCard.EVENT] = "event";
baseMap[ExperienceCategoryCard.ROOM] = "room";
baseMap[ExperienceCategoryCard.LAB] = "lab";

function capitalize(value: string): string {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function translateExperienceCategory(
  category: string | ExperienceCategory | ExperienceCategoryCard | null | undefined,
  t: TFunction,
  fallback?: string
): string {
  if (!category) {
    return fallback ?? "";
  }

  const raw = String(category).trim();

  if (!raw) {
    return fallback ?? "";
  }

  const normalizedKey = baseMap[raw] ?? baseMap[raw.toLowerCase()] ?? raw.toLowerCase();
  const candidateKeys = [
    `common.${normalizedKey}`,
    `common.${normalizedKey}`,
  ];

  for (const key of candidateKeys) {
    const translated = t(key, { defaultValue: "" });

    if (translated) {
      return translated;
    }
  }

  const pluralBase = normalizedKey.endsWith("s")
    ? normalizedKey
    : `${normalizedKey}s`;
  const pluralKey = `homeCards.${pluralBase}.title`;
  const translatedPlural = t(pluralKey, { defaultValue: "" });

  if (translatedPlural) {
    return translatedPlural;
  }

  return fallback ?? capitalize(raw);
}
