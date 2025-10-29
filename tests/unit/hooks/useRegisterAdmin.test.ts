import { renderHookWithProviders } from "@/test/test-utils";
import { useRegisterAdmin } from "@/hooks/useRegisterAdmin";
import * as userApi from "@/api/user";
import { vi } from "vitest";
import type { RegisterUserAdminPayload } from "@/api/user";

vi.mock("@/components/toast/toast", () => ({ appToast: { error: vi.fn() } }));
vi.mock("@/api/user", () => ({ registerUserAdminRequest: vi.fn() }));

describe("useRegisterAdmin", () => {
  const minimalPayload: RegisterUserAdminPayload = {
    name: "n",
    email: "e",
    phone: "p",
    gender: "g",
    zipCode: "z",
    country: "c",
    userType: "PROFESSOR",
    isForeign: false,
    addressLine: "a",
    password: "pw",
  };

  afterEach(() => vi.restoreAllMocks());

  it("calls onError and shows toast when request fails with message", async () => {
    const err = { response: { data: { message: "bad" } } };

    (
      userApi.registerUserAdminRequest as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(err);

    const { result } = renderHookWithProviders(() => useRegisterAdmin());

    const payload: RegisterUserAdminPayload = {
      name: "n",
      email: "e",
      phone: "p",
      gender: "g",
      zipCode: "z",
      country: "c",
      userType: "PROFESSOR",
      isForeign: false,
      addressLine: "a",
      password: "pw",
    };

    try {
      await result.current.mutateAsync(payload);
    } catch {
      // expected
    }

    const { appToast } = await import("@/components/toast/toast");

    expect(appToast.error).toHaveBeenCalledWith("bad");
  });

  it("shows default toast when error has no message (response.data.message missing)", async () => {
    const err = { response: { data: {} } };

    (
      userApi.registerUserAdminRequest as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(err);

    const { result } = renderHookWithProviders(() => useRegisterAdmin());

    try {
      await result.current.mutateAsync(minimalPayload);
    } catch {
      // expected
    }

    const { appToast } = await import("@/components/toast/toast");

    expect(appToast.error).toHaveBeenCalledWith("Erro inesperado");
  });

  it("shows default toast when error has no response (network error)", async () => {
    const err = new Error("network");

    (
      userApi.registerUserAdminRequest as unknown as ReturnType<typeof vi.fn>
    ).mockRejectedValue(err);

    const { result } = renderHookWithProviders(() => useRegisterAdmin());

    try {
      await result.current.mutateAsync(minimalPayload);
    } catch {
      // expected
    }

    const { appToast } = await import("@/components/toast/toast");

    expect(appToast.error).toHaveBeenCalledWith("Erro inesperado");
  });
});
