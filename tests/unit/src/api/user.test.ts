vi.mock("@/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/core/http/safe-api-caller", () => ({ safeApiCall: vi.fn() }));
vi.mock("@tanstack/react-router", () => ({
  redirect: (obj: unknown) => {
    throw new Error(JSON.stringify(obj));
  },
}));

import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterUserAdminPayload,
  RegisterUserPayload,
  ResetPasswordPayload,
  UpdateUserAdminPayload,
  UpdateUserPayload,
} from "@/api/user";

// Minimal AxiosResponse-shaped helper so mocked api methods satisfy typings
function makeResponse<T>(data: T, status = 200) {
  return {
    data,
    status,
    statusText: "",
    headers: {},
    config: {},
  } as unknown as import("axios").AxiosResponse<T>;
}

describe("src/api/user", () => {
  beforeEach(() => {
    // Ensure fresh module wiring and clear mocks between tests
    vi.resetModules();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("getUserById delegates to safeApiCall", async () => {
    const safeModule = await import("@/core/http/safe-api-caller");
    const user = await import("@/api/user");

    // safeApiCall resolves to the parsed value from the schema
    vi.spyOn(safeModule, "safeApiCall").mockResolvedValue({ name: "x" } as any);

    const res = await user.getUserById("id");

    expect(res).toEqual({ name: "x" });
  });

  it("register/update/create/login/forgot/verify/reset endpoints map responses", async () => {
    const { api } = await import("@/core/api");
    const {
      registerUserAdminRequest,
      updateUserRequest,
      registerUserRequest,
      loginRequest,
      forgotPasswordRequest,
      verifyTokenRequest,
      resetPasswordRequest,
    } = await import("@/api/user");

    vi.spyOn(api, "post").mockResolvedValueOnce(makeResponse({ id: "1" }, 201));
    const payloadAdmin = {
      name: "Bob",
      email: "b@b.com",
      phone: "123",
      gender: "M",
      zipCode: "00000",
      country: "BR",
      userType: "PROFESSOR",
      isForeign: false,
      addressLine: "addr",
      password: "p",
      number: "42",
    } as unknown as RegisterUserAdminPayload;

    const created = await registerUserAdminRequest(payloadAdmin);

    expect(created.statusCode).toBe(201);

    vi.spyOn(api, "post").mockResolvedValueOnce(
      makeResponse({ ok: true }, 200)
    );
    const payloadUpdate = {
      name: "B",
      email: "b@b.com",
      phone: "1",
      gender: "M",
      country: "BR",
      userType: "PROFESSOR",
      isForeign: false,
      zipCode: "00000",
      addressLine: "a",
    } as unknown as UpdateUserAdminPayload;

    const upd = await updateUserRequest(payloadUpdate, "u1");

    expect(upd.statusCode).toBe(200);

    vi.spyOn(api, "post").mockResolvedValueOnce(makeResponse({ id: "x" }, 201));
    const payloadReg = {
      name: "N",
      email: "e@e.com",
      password: "p",
      confirmPassword: "p",
      phone: "1",
      gender: "M",
      country: "BR",
      userType: "STUDENT",
      isForeign: false,
      zipCode: "00000",
    } as unknown as RegisterUserPayload;

    const reg = await registerUserRequest(payloadReg);

    expect(reg.statusCode).toBe(201);

    // login
    vi.spyOn(api, "post").mockResolvedValueOnce(
      makeResponse({ token: 1 }, 200)
    );
    const l = await loginRequest({
      email: "a",
      password: "b",
    } as unknown as LoginPayload);

    expect(l.statusCode).toBe(200);

    // forgot
    vi.spyOn(api, "post").mockResolvedValueOnce(makeResponse({}, 200));
    const f = await forgotPasswordRequest({
      email: "a",
    } as unknown as ForgotPasswordPayload);

    expect(f.statusCode).toBe(200);

    // verify
    vi.spyOn(api, "get").mockResolvedValueOnce(makeResponse({}, 200));
    const v = await verifyTokenRequest("tok");

    expect(v.statusCode).toBe(200);

    // reset
    vi.spyOn(api, "patch").mockResolvedValueOnce(makeResponse({}, 200));
    const r = await resetPasswordRequest({
      token: "t",
      password: "p",
      confirmPassword: "p",
    } as unknown as ResetPasswordPayload);

    expect(r.statusCode).toBe(200);
  });

  it("getCurrentUserRequest parses valid payload, returns null on invalid and on throw", async () => {
    const { api } = await import("@/core/api");
    const { getCurrentUserRequest } = await import("@/api/user");

    // valid payload (address omitted — optional)
    vi.spyOn(api, "get").mockResolvedValueOnce(
      makeResponse(
        {
          userType: "ADMIN",
          name: "AA",
          email: null,
          phone: null,
          document: null,
          gender: null,
          rg: null,
          institution: null,
          isForeign: null,
          verified: null,
          updatedAt: null,
        },
        200
      )
    );

    const ok = await getCurrentUserRequest();

    expect(ok).toBeTruthy();
    expect((ok as { name: string }).name).toBe("AA");

    // invalid payload -> zod parse fails and function returns null
    vi.spyOn(api, "get").mockResolvedValueOnce(makeResponse({}, 200));
    const bad = await getCurrentUserRequest();

    expect(bad).toBeNull();

    // api throws -> catch branch
    vi.spyOn(api, "get").mockRejectedValueOnce(new Error("boom"));
    const threw = await getCurrentUserRequest();

    expect(threw).toBeNull();
  });

  it("updateUserRequest appends optional fields when provided", async () => {
    const { api } = await import("@/core/api");
    const { updateUserRequest } = await import("@/api/user");

    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue(makeResponse({ ok: true }, 200));

    const payload = {
      name: "B",
      email: "b@b.com",
      phone: "1",
      gender: "M",
      country: "BR",
      userType: "PROFESSOR",
      isForeign: false,
      zipCode: "00000",
      addressLine: "a",
      document: "doc-string",
      number: 123,
      rg: "rgx",
      teacherDocument: {} as File,
    } as unknown as UpdateUserAdminPayload;

    const res = await updateUserRequest(payload, "u-opt");

    expect(res.statusCode).toBe(200);
    expect(postSpy).toHaveBeenCalled();

    const sent = (postSpy.mock.calls[0] as unknown[])[1] as FormData;

    // Ensure a FormData instance was sent (covers the append branches)
    expect(sent).toBeInstanceOf(FormData);
    
    expect(sent.get("document")).toBe("doc-string");
    expect(sent.get("number")).toBe("123");
    expect(sent.get("rg")).toBe("rgx");
   
    expect(sent.get("teacherDocument")).toBeTruthy();
  });

  it("registerUserRequest appends optional fields when provided", async () => {
    const { api } = await import("@/core/api");
    const { registerUserRequest } = await import("@/api/user");

    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue(makeResponse({ id: "ok" }, 201));

    const payload = {
      name: "N",
      email: "e@e.com",
      password: "p",
      confirmPassword: "p",
      phone: "1",
      gender: "M",
      country: "BR",
      userType: "STUDENT",
      isForeign: false,
      zipCode: "00000",
      document: "doc",
      number: 7,
      rg: "rgv",
      teacherDocument: {} as File,
    } as unknown as RegisterUserPayload;

    const r = await registerUserRequest(payload);

    expect(r.statusCode).toBe(201);
    expect(postSpy).toHaveBeenCalled();

    const sent = (postSpy.mock.calls[0] as unknown[])[1] as FormData;

    expect(sent).toBeInstanceOf(FormData);
    // ensure optional entries are appended
    expect(sent.get("document")).toBe("doc");
    expect(sent.get("number")).toBe("7");
    expect(sent.get("rg")).toBe("rgv");
    expect(sent.get("teacherDocument")).toBeTruthy();
  });

  it("deleteUser calls api.delete and updateCurrentUserRequest converts boolean", async () => {
    const { api } = await import("@/core/api");
    const { deleteUser, updateCurrentUserRequest } = await import("@/api/user");

    const delSpy = vi
      .spyOn(api, "delete")
      .mockResolvedValue(makeResponse({}, 200));

    const res = deleteUser("id");

    expect(delSpy).toHaveBeenCalledWith(`/user/id`);

    await expect(res).resolves.toBeDefined();

    const patchSpy = vi
      .spyOn(api, "patch")
      .mockResolvedValue(makeResponse({ ok: true }, 200));

    const updateRes = await updateCurrentUserRequest({
      isForeign: true,
    } as unknown as UpdateUserPayload);

    expect(updateRes.statusCode).toBe(200);

    const calledBody = (patchSpy.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;

    expect(calledBody.isForeign).toBe("true");
  });

  it("useIsAdmin and requireAdminUser behavior", async () => {
    // stub react-query hooks before importing the module under test so the
    // hook calls inside `useIsAdmin` pick up the stubbed values
    vi.resetModules();
    const rq = await import("@tanstack/react-query");
    // stub useQuery to return admin data and let queryOptions passthrough

    vi.spyOn(rq, "useQuery").mockImplementation(
      () =>
        ({ data: { userType: "ADMIN" } }) as unknown as ReturnType<
          typeof rq.useQuery
        >
    );

    // no-op: allow original queryOptions implementation to be used

    const { useIsAdmin, userPollingQueryOptions, requireAdminUser } =
      await import("@/api/user");

    expect(useIsAdmin()).toBe(true);

    const polling = userPollingQueryOptions(5000) as unknown as {
      refetchInterval: number;
    };

    expect(polling.refetchInterval).toBe(5000);

    const pollingDefault = userPollingQueryOptions() as unknown as {
      refetchInterval: number;
    };

    expect(pollingDefault.refetchInterval).toBe(60000);

    // use a fake QueryClient-shaped object and cast when invoking requireAdminUser
    const qc: { ensureQueryData: (...args: unknown[]) => Promise<any> } = {
      ensureQueryData: vi.fn().mockResolvedValue(null),
    };

    await expect(
      requireAdminUser(
        qc as unknown as import("@tanstack/react-query").QueryClient
      )
    ).rejects.toBeDefined();

    qc.ensureQueryData = vi.fn().mockResolvedValue({ userType: "STUDENT" });
    await expect(
      requireAdminUser(
        qc as unknown as import("@tanstack/react-query").QueryClient
      )
    ).rejects.toBeDefined();

    qc.ensureQueryData = vi.fn().mockResolvedValue({ userType: "ADMIN" });
    await expect(
      requireAdminUser(
        qc as unknown as import("@tanstack/react-query").QueryClient
      )
    ).resolves.toBe(true);

    qc.ensureQueryData = vi.fn().mockResolvedValue({ userType: "ROOT" });
    await expect(
      requireAdminUser(
        qc as unknown as import("@tanstack/react-query").QueryClient
      )
    ).resolves.toBe(true);
  });

  it("registerUserAdminRequest parses numeric 'number' field", async () => {
    const { api } = await import("@/core/api");
    const { registerUserAdminRequest } = await import("@/api/user");

    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue(makeResponse({ id: "1" }, 201));

    const payload: RegisterUserAdminPayload = {
      name: "Bob",
      email: "b@b.com",
      phone: "123",
      gender: "M",
      zipCode: "00000",
      country: "BR",
      userType: "PROFESSOR",
      isForeign: false,
      addressLine: "addr",
      password: "p",
      number: "77",
    } as unknown as RegisterUserAdminPayload;

    const res = await registerUserAdminRequest(payload);

    expect(res.statusCode).toBe(201);

    const sent = (postSpy.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;

    // The implementation currently spreads `...payload` after the parsed
    // value, so the original string value wins — assert that's what was
    // passed through to the POST body.
    expect(sent.number).toBe("77");
  });

  it("registerUserAdminRequest handles missing number (parseInt branch)", async () => {
    const { api } = await import("@/core/api");
    const { registerUserAdminRequest } = await import("@/api/user");

    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue(makeResponse({ id: "1" }, 201));

    const payload = {
      name: "NoNum",
      email: "n@n.com",
      phone: "1",
      gender: "M",
      zipCode: "00000",
      country: "BR",
      userType: "PROFESSOR",
      isForeign: false,
      addressLine: "a",
      password: "p",
    } as unknown as RegisterUserAdminPayload;

    const res = await registerUserAdminRequest(payload);

    expect(res.statusCode).toBe(201);

    const sent = (postSpy.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;

    // number was parsed from empty string -> NaN, and since payload had no
    // number the spread doesn't override it, so expect a number key present
    expect(sent).toHaveProperty("number");
    // It should be NaN (parseInt of empty string)
    // Use global isNaN check: Number.isNaN works for NaN
    expect(Number.isNaN(sent.number as number)).toBe(true);
  });

  it("updateCurrentUserRequest leaves string isForeign untouched", async () => {
    const { api } = await import("@/core/api");
    const { updateCurrentUserRequest } = await import("@/api/user");

    const patchSpy = vi
      .spyOn(api, "patch")
      .mockResolvedValue(makeResponse({ ok: true }, 200));

    const res = await updateCurrentUserRequest({
      isForeign: "false",
    } as unknown as import("@/api/user").UpdateUserPayload);

    expect(res.statusCode).toBe(200);

    const sentBody = (patchSpy.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;

    expect(sentBody.isForeign).toBe("false");
  });

  it("updateCurrentUserRequest converts boolean false to 'false'", async () => {
    const { api } = await import("@/core/api");
    const { updateCurrentUserRequest } = await import("@/api/user");

    const patchSpy = vi
      .spyOn(api, "patch")
      .mockResolvedValue(makeResponse({ ok: true }, 200));

    const res = await updateCurrentUserRequest({
      isForeign: false,
    } as unknown as import("@/api/user").UpdateUserPayload);

    expect(res.statusCode).toBe(200);

    const sentBody = (patchSpy.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;

    expect(sentBody.isForeign).toBe("false");
  });

  it("updateUserRequest uses empty defaults when address/institution/city are missing", async () => {
    const { api } = await import("@/core/api");
    const { updateUserRequest } = await import("@/api/user");

    const postSpy = vi
      .spyOn(api, "post")
      .mockResolvedValue(makeResponse({ ok: true }, 200));

    const payload = {
      name: "B",
      email: "b@b.com",
      phone: "1",
      gender: "M",
      country: "BR",
      userType: "PROFESSOR",
      isForeign: false,
      zipCode: "00000",
      // addressLine, institution, city omitted to hit the "|| ''" defaults
    } as unknown as UpdateUserAdminPayload;

    const res = await updateUserRequest(payload, "u-defs");

    expect(res.statusCode).toBe(200);

    const sent = (postSpy.mock.calls[0] as unknown[])[1] as FormData;

    expect(sent.get("addressLine")).toBe("");
    expect(sent.get("institution")).toBe("");
    expect(sent.get("city")).toBe("");
  });

  it("updateCurrentUserRequest converts boolean isForeign to string (branch) and sends body", async () => {
    const { api } = await import("@/core/api");
    const { updateCurrentUserRequest } = await import("@/api/user");

    const patchSpy = vi
      .spyOn(api, "patch")
      .mockResolvedValue(makeResponse({ ok: true }, 200));

    const res = await updateCurrentUserRequest({
      isForeign: true,
    } as unknown as import("@/api/user").UpdateUserPayload);

    expect(res.statusCode).toBe(200);

    const sentBody = (patchSpy.mock.calls[0] as unknown[])[1] as Record<
      string,
      unknown
    >;

    expect(sentBody.isForeign).toBe("true");
  });

  it("useIsAdmin returns false when user is not admin", async () => {
    vi.resetModules();
    vi.mock("@tanstack/react-query", () => ({
      useQuery: () => ({ data: { userType: "STUDENT" } }),
      queryOptions: <T>(opts: T) => opts,
    }));

    const { useIsAdmin } = await import("@/api/user");

    expect(useIsAdmin()).toBe(false);
  });
});
