    import type { AxiosResponse } from "axios";
    import {
      type RegisterUserAdminPayload,
      type RegisterUserPayload,
      type UpdateUserAdminPayload,
      type UpdateUserPayload,
      deleteUser,
      forgotPasswordRequest,
      getCurrentUserRequest,
      getUserById,
      loginRequest,
      mapGenderToApiValue,
      registerUserAdminRequest,
      registerUserRequest,
      requireAdminUser,
      resetPasswordRequest,
      updateCurrentUserRequest,
      updateUserRequest,
      useIsAdmin,
      userPollingQueryOptions,
      userQueryOptions,
      verifyTokenRequest,
    } from "@/api/user";
    import type { UserType } from "@/types/user";
    import type { QueryClient } from "@tanstack/react-query";

    type PostFn = (url: string, data?: unknown, config?: unknown) => Promise<AxiosResponse<unknown>>;
    type PatchFn = (url: string, data?: unknown, config?: unknown) => Promise<AxiosResponse<unknown>>;
    type GetFn = (url: string, config?: unknown) => Promise<AxiosResponse<unknown>>;
    type DeleteFn = (url: string, config?: unknown) => Promise<AxiosResponse<unknown>>;

    const postMock = vi.hoisted(() => vi.fn<PostFn>());
    const patchMock = vi.hoisted(() => vi.fn<PatchFn>());
    const getMock = vi.hoisted(() => vi.fn<GetFn>());
    const deleteMock = vi.hoisted(() => vi.fn<DeleteFn>());
    const safeApiCallMock = vi.hoisted(() => vi.fn());
    const digitsOnlyMock = vi.hoisted(() => vi.fn((value: string) => value.replace(/\D/g, "")));
    const useQueryMock = vi.hoisted(() => vi.fn());
    const queryOptionsMock = vi.hoisted(() => vi.fn((options: unknown) => options));
    const redirectMock = vi.hoisted(() => vi.fn((args: { to: string }) => ({ type: "redirect", to: args.to })));

    const createAxiosResponse = <T>(data: T, status = 200): AxiosResponse<T> =>
      ({
        data,
        status,
        statusText: "OK",
        headers: {},
        config: {},
      }) as AxiosResponse<T>;

    vi.mock("@/core/api", () => ({ api: { post: postMock, patch: patchMock, get: getMock, delete: deleteMock } }));
    vi.mock("@/core/http/safe-api-caller", () => ({ safeApiCall: safeApiCallMock }));
    vi.mock("@/lib/utils", () => ({ digitsOnly: digitsOnlyMock }));
    vi.mock("@tanstack/react-query", () => ({
      QueryClient: class {},
      useQuery: useQueryMock,
      queryOptions: queryOptionsMock,
    }));
    vi.mock("@tanstack/react-router", () => ({ redirect: redirectMock }));

    describe("user api", () => {
      beforeEach(() => {
        vi.clearAllMocks();
        postMock.mockReset();
        patchMock.mockReset();
        getMock.mockReset();
        deleteMock.mockReset();
        safeApiCallMock.mockReset();
        digitsOnlyMock.mockImplementation((value: string) => value.replace(/\D/g, ""));
        useQueryMock.mockReset();
        queryOptionsMock.mockImplementation((options: unknown) => options);
        redirectMock.mockImplementation((args: { to: string }) => ({ type: "redirect", to: args.to }));
      });

      it("maps gender to api value", () => {
        expect(mapGenderToApiValue(undefined)).toBeUndefined();
        expect(mapGenderToApiValue("")).toBeUndefined();
        expect(mapGenderToApiValue("   ")).toBeUndefined();
        expect(mapGenderToApiValue("male")).toBe("Masculino");
        expect(mapGenderToApiValue("female")).toBe("Feminino");
        expect(mapGenderToApiValue("Other")).toBe("Other");
      });

      it("registers admin user with transformed payload", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 201));

        const payload: RegisterUserAdminPayload = {
          name: "Admin",
          email: "admin@test.com",
          password: "pass",
          gender: "male",
          number: "7",
          phone: "123",
          zipCode: "00000",
          country: "BR",
          userType: "ADMIN" as UserType,
          isForeign: false,
          addressLine: "",
          institution: "",
          city: "",
        };

        const res = await registerUserAdminRequest(payload);

        expect(postMock).toHaveBeenCalledWith("/auth/create-root-user", expect.any(Object));

        const [, body] = postMock.mock.calls[0];

        expect((body as RegisterUserAdminPayload).gender).toBe("Masculino");
        expect((body as RegisterUserAdminPayload).number).toBe("7");
        expect(res).toEqual({
          statusCode: 201,
          message: "Usuário registrado com sucesso",
          data: { ok: true },
        });
      });

      it("updates user with form data fields", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        const payload: UpdateUserAdminPayload = {
          name: "User",
          email: "u@test.com",
          phone: "123",
          gender: "female",
          country: "BR",
          userType: "ADMIN" as UserType,
          isForeign: true,
          zipCode: "12345",
          addressLine: "Street",
          institution: "Inst",
          city: "City",
          document: "doc",
          number: 9,
          rg: "rg",
          teacherDocument: new File(["x"], "tdoc.pdf"),
        };

        await updateUserRequest(payload, "uid-1");

        const form = patchMock.mock.calls[0][1] as FormData;

        expect(form.get("name")).toBe("User");
        expect(form.get("gender")).toBe("Feminino");
        expect(form.get("number")).toBe("9");
        expect(form.get("teacherDocument")).toBeInstanceOf(File);
      });

      it("registers user with form data fields and optional docs", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 201));

        const payload: RegisterUserPayload = {
          name: "Client",
          email: "c@test.com",
          password: "123",
          confirmPassword: "123",
          phone: "999",
          gender: "other",
          country: "BR",
          userType: "CLIENT" as UserType,
          isForeign: false,
          zipCode: "000",
          addressLine: "",
          institution: "",
          city: "",
          document: "doc",
        };

        await registerUserRequest(payload);

        const form = postMock.mock.calls.at(-1)![1] as FormData;

        expect(form.get("confirmPassword")).toBe("123");
        expect(form.get("document")).toBe("doc");
        expect(form.get("gender")).toBe("other");
      });

      it("registers user including numeric fields and teacher document", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 201));

        const payload: RegisterUserPayload = {
          name: "Teacher",
          email: "teacher@test.com",
          password: "abc",
          confirmPassword: "abc",
          phone: "123",
          gender: "male",
          country: "BR",
          userType: "CLIENT" as UserType,
          isForeign: true,
          zipCode: "12345",
          addressLine: "Street",
          institution: "Inst",
          city: "City",
          document: "doc",
          number: 42,
          rg: "111",
          teacherDocument: new File(["data"], "teacher.pdf"),
        };

        await registerUserRequest(payload);

        const form = postMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("number")).toBe("42");
        expect(form.get("teacherDocument")).toBeInstanceOf(File);
        expect(form.get("gender")).toBe("Masculino");
      });

      it("skips document field when not provided in registration", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 201));

        const payload: RegisterUserPayload = {
          name: "NoDoc",
          email: "nd@test.com",
          password: "123",
          confirmPassword: "123",
          phone: "000",
          gender: "female",
          country: "BR",
          userType: "CLIENT" as UserType,
          isForeign: false,
          zipCode: "000",
          addressLine: "",
          institution: "",
          city: "",
        };

        await registerUserRequest(payload);

        const form = postMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("document")).toBeNull();
      });

      it("falls back to empty gender when registering user without value", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 201));

        const payload: RegisterUserPayload = {
          name: "NoGender",
          email: "ng@test.com",
          password: "123",
          confirmPassword: "123",
          phone: "000",
          gender: "",
          country: "BR",
          userType: "CLIENT" as UserType,
          isForeign: false,
          zipCode: "000",
          addressLine: "",
          institution: "",
          city: "",
        };

        await registerUserRequest(payload);

        const form = postMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("gender")).toBe("");
      });

      it("omits optional fields when they are not provided", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        const minimalPayload: UpdateUserAdminPayload = {
          name: "NoDocs",
          email: "n@test.com",
          phone: "0",
          gender: "",
          country: "BR",
          userType: "ADMIN" as UserType,
          isForeign: false,
          zipCode: "000",
          addressLine: "",
          institution: "",
          city: "",
        };

        await updateUserRequest(minimalPayload, "uid-2");

        const form = patchMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("document")).toBeNull();
        expect(form.get("number")).toBeNull();
        expect(form.get("rg")).toBeNull();
        expect(form.get("teacherDocument")).toBeNull();
      });

      it("uses empty defaults when admin address fields are missing", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        const payload: UpdateUserAdminPayload = {
          name: "NoAddress",
          email: "n@test.com",
          phone: "0",
          gender: "male",
          country: "BR",
          userType: "ADMIN" as UserType,
          isForeign: false,
          zipCode: "11111",
        };

        await updateUserRequest(payload, "uid-empty");

        const form = patchMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("addressLine")).toBe("");
        expect(form.get("institution")).toBe("");
        expect(form.get("city")).toBe("");
      });

      it("defaults admin number and gender when absent", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 201));

        const payload = {
          name: "Missing",
          email: "m@test.com",
          password: "pass",
          gender: undefined,
          number: undefined,
          phone: "1",
          zipCode: "000",
          country: "BR",
          userType: "ADMIN" as UserType,
          isForeign: false,
          addressLine: "",
          institution: "",
          city: "",
        } as unknown as RegisterUserAdminPayload;

        await registerUserAdminRequest(payload);

        const body = postMock.mock.calls.at(-1)?.[1] as Record<string, unknown>;

        expect(body.gender).toBe("");
        expect(body.number).toBeUndefined();
      });

      it("preserves parsed NaN number when admin payload omits the field", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ id: "1" }, 201));

        const payload = {
          name: "NoNum",
          email: "n@n.com",
          phone: "1",
          gender: "male",
          zipCode: "00000",
          country: "BR",
          userType: "ADMIN" as UserType,
          isForeign: false,
          addressLine: "Street",
          password: "pass",
        } as RegisterUserAdminPayload;

        await registerUserAdminRequest(payload);

        const body = postMock.mock.calls.at(-1)?.[1] as Record<string, unknown>;

        expect(body).toHaveProperty("number");
        expect(Number.isNaN(body.number as number)).toBe(true);
      });

      it("gets user by id via safe api caller", async () => {
        const pendingResponse = Promise.resolve(createAxiosResponse({ ok: true }));

        getMock.mockReturnValue(pendingResponse);
        safeApiCallMock.mockResolvedValue({ id: "1" });

        const result = await getUserById("1");

        expect(getMock).toHaveBeenCalledWith("/user/1");
        expect(safeApiCallMock).toHaveBeenCalledWith(pendingResponse, expect.anything());
        expect(result).toEqual({ id: "1" });
      });

      it("logs in user and normalizes response", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ token: "abc" }, 200));

        const payload = { email: "user@test.com", password: "secret" };

        const result = await loginRequest(payload);

        expect(postMock).toHaveBeenCalledWith("/auth/signIn", payload);
        expect(result).toEqual({
          statusCode: 200,
          message: "Login realizado com sucesso",
          data: { token: "abc" },
        });
      });

      it("handles forgot password requests", async () => {
        postMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        const payload = { email: "forgot@test.com" };

        const result = await forgotPasswordRequest(payload);

        expect(postMock).toHaveBeenCalledWith("/auth/forgot", payload);
        expect(result.message).toBe("Email enviado com sucesso");
      });

      it("verifies token via get request", async () => {
        getMock.mockResolvedValue(createAxiosResponse({ valid: true }, 200));

        const result = await verifyTokenRequest("token-1");

        expect(getMock).toHaveBeenCalledWith("/auth/forgot/token-1");
        expect(result.message).toBe("Token verificado com sucesso");
      });

      it("resets password via patch request", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        const payload = { token: "t", password: "123", confirmPassword: "123" };

        const result = await resetPasswordRequest(payload);

        expect(patchMock).toHaveBeenCalledWith("/auth/forgot", payload);
        expect(result.message).toBe("Senha redefinida com sucesso");
      });

      it("deletes user by id", async () => {
        const response = createAxiosResponse({ deleted: true }, 200);

        deleteMock.mockResolvedValue(response);

        const result = await deleteUser("uid-3");

        expect(deleteMock).toHaveBeenCalledWith("/user/uid-3");
        expect(result).toBe(response);
      });

      it("updates current user with provided fields", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        const payload: UpdateUserPayload = {
          name: "Profile",
          phone: "999",
          gender: "female",
          addressLine: "Av. Test",
          city: "City",
          number: 77,
          zipCode: "123-456",
          institution: "Inst",
          country: "BR",
          isForeign: true,
          teacherDocument: new File(["content"], "teacher.pdf"),
        };

        const response = await updateCurrentUserRequest(payload);
        const form = patchMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("name")).toBe("Profile");
        expect(form.get("gender")).toBe("female");
        expect(form.get("number")).toBe("77");
        expect(form.get("zipCode")).toBe("123456");
        expect(form.get("isForeign")).toBe("true");
        expect(form.get("teacherDocument")).toBeInstanceOf(File);
        expect(digitsOnlyMock).toHaveBeenCalledWith("123-456");
        expect(response.message).toBe("Perfil atualizado com sucesso");
      });

      it("keeps string isForeign values untouched when updating current user", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        await updateCurrentUserRequest({
          isForeign: "false",
        });

        const form = patchMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.get("isForeign")).toBe("false");
      });

      it("omits isForeign field when updating current user with boolean false", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        await updateCurrentUserRequest({
          isForeign: false,
        });

        const form = patchMock.mock.calls.at(-1)?.[1] as FormData;

        expect(form.has("isForeign")).toBe(false);
      });

      it("skips appending empty fields when updating current user", async () => {
        patchMock.mockResolvedValue(createAxiosResponse({ ok: true }, 200));

        await updateCurrentUserRequest({});

        const form = patchMock.mock.calls.at(-1)?.[1] as FormData;

        expect(Array.from(form.entries())).toHaveLength(0);
      });

      it("parses current user profile payloads", async () => {
        const iso = new Date().toISOString();

        getMock.mockResolvedValue(
          createAxiosResponse({
            userType: "ADMIN",
            name: "Alice",
            email: "alice@test.com",
            phone: null,
            document: null,
            gender: "female",
            rg: null,
            institution: "Inst",
            isForeign: false,
            verified: true,
            updatedAt: iso,
            address: {
              street: "Main",
              number: "10",
              city: "City",
              zip: "12345",
              country: "BR",
              updatedAt: iso,
            },
          }),
        );

        const result = await getCurrentUserRequest();

        expect(getMock).toHaveBeenCalledWith("/auth/profile");
        expect(result).toMatchObject({ name: "Alice", address: { street: "Main" } });
      });

      it("returns null and logs when profile payload is invalid", async () => {
        getMock.mockResolvedValue(createAxiosResponse({}));
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const result = await getCurrentUserRequest();

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith("Invalid profile payload", expect.anything());

        consoleSpy.mockRestore();
      });

      it("returns null when fetching profile fails", async () => {
        getMock.mockRejectedValue(new Error("boom"));
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

        const result = await getCurrentUserRequest();

        expect(result).toBeNull();
        expect(consoleSpy).not.toHaveBeenCalled();

        consoleSpy.mockRestore();
      });

      it("exposes default user query options", () => {
        expect(userQueryOptions.queryKey).toEqual(["me"]);
        expect(userQueryOptions.refetchInterval).toBe(10000);
        expect(userQueryOptions.retry).toBe(false);
      });

      it("builds polling options with overridable interval", () => {
        const defaultPolling = userPollingQueryOptions();
        const fastPolling = userPollingQueryOptions(5000);

        expect(defaultPolling.refetchInterval).toBe(60000);
        expect(defaultPolling.queryFn).toBe(userQueryOptions.queryFn);
        expect(fastPolling.refetchInterval).toBe(5000);
      });

      it("detects admin users via useIsAdmin", () => {
        useQueryMock.mockReturnValue({ data: { userType: "ADMIN" } });
        expect(useIsAdmin()).toBe(true);

        useQueryMock.mockReturnValue({ data: { userType: "ROOT" } });
        expect(useIsAdmin()).toBe(true);

        useQueryMock.mockReturnValue({ data: { userType: "CLIENT" } });
        expect(useIsAdmin()).toBe(false);
      });

      it("requires admin users and redirects otherwise", async () => {
        const adminEnsureQueryData = vi.fn().mockResolvedValue({ userType: "ADMIN" as UserType });
        const adminClient = { ensureQueryData: adminEnsureQueryData } as unknown as QueryClient;

        await expect(requireAdminUser(adminClient)).resolves.toBe(true);
        expect(adminEnsureQueryData).toHaveBeenCalledWith(userQueryOptions);

        const rootEnsureQueryData = vi.fn().mockResolvedValue({ userType: "ROOT" as UserType });
        const rootClient = { ensureQueryData: rootEnsureQueryData } as unknown as QueryClient;

        await expect(requireAdminUser(rootClient)).resolves.toBe(true);

        const missingEnsureQueryData = vi.fn().mockResolvedValue(null);
        const missingClient = { ensureQueryData: missingEnsureQueryData } as unknown as QueryClient;

        await expect(requireAdminUser(missingClient)).rejects.toEqual({ type: "redirect", to: "/auth/login" });

        const nonAdminEnsureQueryData = vi.fn().mockResolvedValue({ userType: "CLIENT" as UserType });
        const nonAdminClient = { ensureQueryData: nonAdminEnsureQueryData } as unknown as QueryClient;

        await expect(requireAdminUser(nonAdminClient)).rejects.toEqual({ type: "redirect", to: "/" });
      });
    });
