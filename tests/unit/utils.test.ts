import { describe, expect, it } from "vitest";

import { cn, digitsOnly, maskCep, maskCpf, maskPhone } from "@/lib/utils";

describe("utils", () => {
  it("merges class names without duplicates", () => {
    expect(cn("font-bold", "font-bold", "text-sm")).toBe(
      "font-bold text-sm"
    );
  });

  it("keeps only numeric characters", () => {
    expect(digitsOnly("(51) 99999-0000")).toBe("51999990000");
  });

  it("masks CPF correctly", () => {
    expect(maskCpf("12345678901")).toBe("123.456.789-01");
  });

  it("masks CEP correctly", () => {
    expect(maskCep("91510000")).toBe("91510-000");
  });

  it("formats phone numbers with DDD", () => {
    expect(maskPhone("51999990000")).toBe("(51) 99999-0000");
  });
});
