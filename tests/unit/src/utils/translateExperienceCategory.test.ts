import { afterEach, describe, expect, it, vi } from "vitest";

import {
  __translateExperienceCategoryTesting,
  translateExperienceCategory,
} from "@/utils/translateExperienceCategory";
import { ExperienceCategory, ExperienceCategoryCard } from "@/types/experience";
import type { TFunction } from "i18next";

const createTranslator = (responses: Record<string, string> = {}) => {
  const fn = vi.fn((key: string, options?: { defaultValue?: string }) => {
    if (Object.prototype.hasOwnProperty.call(responses, key)) {
      return responses[key];
    }

    return options?.defaultValue ?? "";
  });

  return {
    translator: fn as unknown as TFunction,
    spy: fn,
  };
};

describe("translateExperienceCategory", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it.each([null, undefined])("returns fallback when category is %s", (input) => {
    const { translator, spy } = createTranslator();

    const result = translateExperienceCategory(input, translator, "N/A");

    expect(result).toBe("N/A");
    expect(spy).not.toHaveBeenCalled();
  });

  it.each([null, undefined])("returns empty string when category is %s and fallback is omitted", (input) => {
    const { translator, spy } = createTranslator();

    const result = translateExperienceCategory(input, translator);

    expect(result).toBe("");
    expect(spy).not.toHaveBeenCalled();
  });

  it("returns empty string when trimmed category is empty and no fallback is provided", () => {
    const { translator, spy } = createTranslator();

    const result = translateExperienceCategory("   ", translator);

    expect(result).toBe("");
    expect(spy).not.toHaveBeenCalled();
  });

  it("prefers mapped translation keys and returns the first successful translation", () => {
    const { translator, spy } = createTranslator({
      "common.trail": "Trilha traduzida",
    });

    const result = translateExperienceCategory(ExperienceCategory.TRILHA, translator);

    expect(result).toBe("Trilha traduzida");
    expect(spy).toHaveBeenCalledWith("common.trail", { defaultValue: "" });
  });

  it("normalizes localized strings using lowercase base map entries", () => {
    const { translator, spy } = createTranslator({
      "common.trail": "Trilha em PT",
    });

    const result = translateExperienceCategory("Trilha", translator);

    expect(result).toBe("Trilha em PT");
    expect(spy).toHaveBeenCalledWith("common.trail", { defaultValue: "" });
  });

  it("falls back to plural home card translation when common namespace is empty", () => {
    const { translator, spy } = createTranslator({
      "homeCards.events.title": "Eventos",
    });

    const result = translateExperienceCategory(ExperienceCategoryCard.EVENT, translator);

    expect(result).toBe("Eventos");
    expect(spy).toHaveBeenCalledWith("homeCards.events.title", { defaultValue: "" });
  });

  it("capitalizes raw value when no translation is available", () => {
    const { translator } = createTranslator();

    const result = translateExperienceCategory("custom-category", translator);

    expect(result).toBe("Custom-category");
  });

  it("uses provided fallback when translation is missing", () => {
    const { translator } = createTranslator();

    const result = translateExperienceCategory("unknown", translator, "Default");

    expect(result).toBe("Default");
  });

  it("does not double pluralize normalized keys that already end with s", () => {
    const { translator, spy } = createTranslator({
      "homeCards.classics.title": "Clássicos",
    });

    const result = translateExperienceCategory("Classics", translator);

    expect(result).toBe("Clássicos");
    expect(spy).toHaveBeenCalledWith("homeCards.classics.title", { defaultValue: "" });
  });

  it("returns empty string when capitalize receives empty input", () => {
    const { capitalize } = __translateExperienceCategoryTesting;

    expect(capitalize("")).toBe("");
  });
});
