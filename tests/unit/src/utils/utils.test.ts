import { afterEach, describe, expect, it, vi } from "vitest";

import {
  cn,
  digitsOnly,
  generateRandomPassword,
  hashPassword,
  isValidBrazilZip,
  isValidCpf,
  isValidForeignZip,
  maskCep,
  maskCpf,
  maskPhone,
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
});
