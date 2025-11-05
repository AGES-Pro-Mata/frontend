import { describe, expect, it } from "vitest";
import { ExperienceAdminResponse } from "@/entities/experiences-admin-response";

describe("ExperienceAdminResponse - Active Field", () => {
  it("should parse experience with active field set to true", () => {
    const payload = {
      id: "test-id",
      name: "Test Experience",
      description: "Test description",
      active: true,
    };

    const result = ExperienceAdminResponse.parse(payload);

    expect(result.active).toBe(true);
  });

  it("should parse experience with active field set to false", () => {
    const payload = {
      id: "test-id",
      name: "Test Experience",
      description: "Test description",
      active: false,
    };

    const result = ExperienceAdminResponse.parse(payload);

    expect(result.active).toBe(false);
  });

  it("should default active to true when not provided", () => {
    const payload = {
      id: "test-id",
      name: "Test Experience",
      description: "Test description",
    };

    const result = ExperienceAdminResponse.parse(payload);

    expect(result.active).toBe(true);
  });

  it("should parse experience without id (optional field)", () => {
    const payload = {
      name: "Test Experience",
      description: "Test description",
      active: false,
    };

    const result = ExperienceAdminResponse.parse(payload);

    expect(result.id).toBeUndefined();
    expect(result.name).toBe("Test Experience");
    expect(result.active).toBe(false);
  });
});
