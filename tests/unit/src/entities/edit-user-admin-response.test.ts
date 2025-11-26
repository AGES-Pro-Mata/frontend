import { describe, expect, it } from "vitest";

import { EditUserAdminResponse } from "@/entities/edit-user-admin-response";

describe("EditUserAdminResponse", () => {
  it("maps admin users to admin and non-professor flags", () => {
    const result = EditUserAdminResponse.parse({
      name: "Jane",
      userType: "ADMIN",
    });

    expect(result.isAdmin).toBe(true);
    expect(result.isProfessor).toBe(false);
  });

  it("maps professor users to professor flag", () => {
    const result = EditUserAdminResponse.parse({
      userType: "PROFESSOR",
    });

    expect(result.isAdmin).toBe(false);
    expect(result.isProfessor).toBe(true);
  });

  it("defaults flags when userType is missing", () => {
    const result = EditUserAdminResponse.parse({});

    expect(result.isAdmin).toBe(false);
    expect(result.isProfessor).toBe(false);
  });
});
