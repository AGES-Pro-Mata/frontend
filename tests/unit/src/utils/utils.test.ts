import { afterEach, describe, expect, it, vi } from "vitest";

import {
  cn,
  dateToIso,
  digitsOnly,
  generateRandomPassword,
  hashPassword,
  isValidBrazilZip,
  isValidCpf,
  isValidForeignZip,
  isoToDate,
  maskCep,
  maskCpf,
  maskDateBR,
  maskPhone,
  toBRForDisplay,
  toIsoFromBR,
} from "@/lib/utils";

describe("utils", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("merges class names without duplicates", () => {
    expect(cn("font-bold", "font-bold", "text-sm")).toBe("font-bold text-sm");
  });

  it("keeps only numeric characters", () => {
    expect(digitsOnly("(51) 99999-0000")).toBe("51999990000");
    expect(digitsOnly(undefined as unknown as string)).toBe("");
  });

  it("masks CPF correctly", () => {
    expect(maskCpf("12345678901")).toBe("123.456.789-01");
  });

  it("masks CPF progressively as digits are typed", () => {
    expect(maskCpf("1")).toBe("1");
    expect(maskCpf("12345")).toBe("123.45");
    expect(maskCpf("1234567")).toBe("123.456.7");
  });

  it("masks CEP correctly", () => {
    expect(maskCep("91510000")).toBe("91510-000");
  });

  it("keeps CEP partial formatting until enough digits are provided", () => {
    expect(maskCep("123")).toBe("123");
    expect(maskCep("12345")).toBe("12345");
  });

  it("formats phone numbers with DDD", () => {
    expect(maskPhone("51999990000")).toBe("(51) 99999-0000");
  });

  it("formats phone numbers according to length", () => {
    expect(maskPhone("")).toBe("");
    expect(maskPhone("5")).toBe("(5");
    expect(maskPhone("51999")).toBe("(51) 999");
    expect(maskPhone("5199990000")).toBe("(51) 9999-0000");
  });

  it("masks Brazilian dates progressively", () => {
    expect(maskDateBR("1")).toBe("1");
    expect(maskDateBR("1201")).toBe("12/01");
    expect(maskDateBR("12012024")).toBe("12/01/2024");
  });

  it("validates CPF values", () => {
    expect(isValidCpf(undefined)).toBe(false);
    expect(isValidCpf("000")).toBe(false);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("validates Brazilian CEP length", () => {
    expect(isValidBrazilZip("12345678")).toBe(true);
    expect(isValidBrazilZip("1234567")).toBe(false);
  });

  it("validates foreign postal code length", () => {
    expect(isValidForeignZip("1234")).toBe(true);
    expect(isValidForeignZip("12")).toBe(false);
  });

  it("generates deterministic password when crypto returns predictable values", () => {
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint32Array) => {
        for (let index = 0; index < array.length; index += 1) {
          array[index] = index;
        }

        return array;
      },
    } as unknown as Crypto);

    const password = generateRandomPassword(5);

    expect(password).toBe(
      [0, 1, 2, 3, 4].map((value) => charset[value % charset.length]).join("")
    );
  });

  it("hashes password using crypto.subtle when available", async () => {
    const digestMock = vi.fn(() =>
      Promise.resolve(new Uint8Array([1, 2, 3, 4]).buffer)
    );

    vi.stubGlobal("crypto", {
      subtle: { digest: digestMock },
      getRandomValues: (array: Uint32Array) => array,
    } as unknown as Crypto);

    await expect(hashPassword("secret")).resolves.toBe("01020304");

    const call = digestMock.mock.calls[0];

    if (!call) {
      throw new Error("Expected crypto.subtle.digest to be called");
    }

    const [algorithm, payload] = call as unknown as [string, Uint8Array];

    expect(algorithm).toBe("SHA-256");
    expect(ArrayBuffer.isView(payload)).toBe(true);
  });

  it("falls back to crypto-js implementation when subtle API is unavailable", async () => {
    vi.stubGlobal("crypto", {
      getRandomValues: (array: Uint32Array) => array,
    } as unknown as Crypto);

    const result = await hashPassword("fallback");

    expect(result).toHaveLength(64);
    expect(result).toMatch(/^[0-9a-f]+$/i);
  });

  it("converts valid Brazilian dates to ISO format", () => {
    expect(toIsoFromBR("05/03/2024")).toBe("2024-03-05");
    expect(toIsoFromBR(" 05/03/2024 ")).toBe("2024-03-05");
  });

  it("returns empty string for invalid Brazilian date inputs", () => {
    const futureYear = new Date().getFullYear() + 1;

    expect(toIsoFromBR("2024-03-05")).toBe("");
    expect(toIsoFromBR("31/12/1899")).toBe("");
    expect(toIsoFromBR(`01/01/${futureYear}`)).toBe("");
    expect(toIsoFromBR("01/13/2024")).toBe("");
    expect(toIsoFromBR("01/00/2024")).toBe("");
    expect(toIsoFromBR("31/04/2024")).toBe("");
    expect(toIsoFromBR("00/01/2024")).toBe("");
  });

  it("returns empty string when Brazilian date input is nullish", () => {
    expect(toIsoFromBR(undefined as unknown as string)).toBe("");
  });

  it("formats ISO dates for display and falls back to masking", () => {
    expect(toBRForDisplay("2024-03-05")).toBe("05/03/2024");
    expect(toBRForDisplay("12012024")).toBe("12/01/2024");
  });

  it("returns empty string for nullish ISO display input", () => {
    expect(toBRForDisplay(undefined as unknown as string)).toBe("");
  });

  it("parses ISO dates and handles invalid construction", () => {
    expect(isoToDate("")).toBeUndefined();

    class FakeDate {
      static now = Date.now;
      static UTC = Date.UTC;
      static parse = Date.parse;

      getTime() {
        return Number.NaN;
      }
    }

    vi.stubGlobal("Date", FakeDate as unknown as DateConstructor);

    expect(isoToDate("2024-01-01")).toBeUndefined();
  });

  it("parses ISO dates and returns real Date instances", () => {
    const result = isoToDate("2024-03-05");

    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2024);
    expect(result?.getMonth()).toBe(2);
    expect(result?.getDate()).toBe(5);
  });

  it("serializes Date instances to ISO strings", () => {
    const date = new Date(2024, 2, 5);

    expect(dateToIso(date)).toBe("2024-03-05");
  });
});
