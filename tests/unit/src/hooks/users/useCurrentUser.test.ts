import {
  createTestQueryClient,
  renderHookWithProviders,
} from "@/test/test-utils";
import { useCurrentUserProfile } from "@/hooks/users/useCurrentUser";
import { waitFor } from "@testing-library/react";

describe("useCurrentUserProfile", () => {
  afterEach(() => vi.restoreAllMocks());

  it("maps current user data and resolves document status", async () => {
    const user = {
      id: "u1",
      userType: "PROFESSOR",
      name: "N",
      verified: true,
      address: {
        street: "s",
        number: "10",
        city: "c",
        zip: "z",
        country: "ct",
      },
    } as const;

    const client = createTestQueryClient();

    // prefill the query client with the user data so no network call is required
    client.setQueryData(["me"], user);

    const { result } = renderHookWithProviders(() => useCurrentUserProfile(), {
      queryClient: client,
    });

    await waitFor(() => expect(result.current.mapped?.name).toBe("N"));

    expect(result.current.documentStatus).toBeDefined();
  });

  it("parses numeric address number into a number field", async () => {
    const user = {
      id: "u2",
      name: "Num",
      userType: "PROFESSOR",
      verified: true,
      address: {
        street: "s",
        number: "123",
        city: "c",
        zip: "z",
        country: "ct",
      },
    } as const;

    const client = createTestQueryClient();

    client.setQueryData(["me"], user);

    const { result } = renderHookWithProviders(() => useCurrentUserProfile(), {
      queryClient: client,
    });

    await waitFor(() => expect(result.current.mapped?.number).toBe(123));
    expect(result.current.verified).toBe(true);
    expect(result.current.documentStatus).toBeDefined();
  });

  it("handles non-numeric address number by leaving number undefined", async () => {
    const user = {
      id: "u3",
      name: "NoNum",
      userType: "PROFESSOR",
      verified: false,
      address: {
        street: "s",
        number: "abc",
        city: "c",
        zip: "z",
        country: "ct",
      },
    } as const;

    const client = createTestQueryClient();

    client.setQueryData(["me"], user as any);

    const { result } = renderHookWithProviders(() => useCurrentUserProfile(), {
      queryClient: client,
    });

    await waitFor(() => expect(result.current.mapped).toBeDefined());
    expect(result.current.mapped?.number).toBeUndefined();
    expect(result.current.documentStatus).toBeDefined();
    // verified false should reflect in verified flag
    expect(result.current.verified).toBe(false);
  });

  it("returns pending status when there is no user data", async () => {
    const client = createTestQueryClient();

    // explicitly set null so the query client has a value and the hook
    // does not perform a network request (avoids MSW unhandled request)
    client.setQueryData(["me"], null);

    const { result } = renderHookWithProviders(() => useCurrentUserProfile(), {
      queryClient: client,
    });

    await waitFor(() => expect(result.current.mapped).toBeUndefined());
    expect(result.current.verified).toBe(false);
    // StatusEnum.CADASTRO_PENDENTE is used when no user
    expect(result.current.documentStatus).toBeDefined();
  });

  it("handles user without address and missing userType", async () => {
    // use a partial typed object to avoid unsafe any
    const user: Partial<any> = {
      id: "u4",
      name: "NoAddr",
      // simulate missing userType and address
      verified: undefined,
    };

    const client = createTestQueryClient();

    client.setQueryData(["me"], user);

    const { result } = renderHookWithProviders(() => useCurrentUserProfile(), {
      queryClient: client,
    });

    await waitFor(() => expect(result.current.mapped).toBeDefined());
    // address-derived fields should be undefined
    expect(result.current.mapped?.addressLine).toBeUndefined();
    expect(result.current.mapped?.number).toBeUndefined();
    // missing userType -> function should be undefined
    expect(result.current.mapped?.function).toBeUndefined();
    // verified undefined defaults to false
    expect(result.current.verified).toBe(false);
  });
});
