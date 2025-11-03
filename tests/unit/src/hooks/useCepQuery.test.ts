import { renderHookWithProviders } from "@/test/test-utils";
import { useCepQuery } from "@/hooks/useCepQuery";
import * as cepApi from "@/api/cep";
import { type Mock, vi } from "vitest";
import { waitFor } from "@testing-library/react";

vi.mock("@/api/cep", () => ({ fetchAddressByZip: vi.fn() }));

describe("useCepQuery", () => {
  afterEach(() => vi.restoreAllMocks());

  it("returns data when cep is 8 digits", async () => {
    const address = { street: "s" };

    (cepApi.fetchAddressByZip as unknown as Mock).mockResolvedValue(address);

    const { result } = renderHookWithProviders(() => useCepQuery("12345678"));

    await waitFor(() => expect(result.current.data).toEqual(address));
  });

  it("accepts formatted cep and calls api with digits only", async () => {
    const address = { street: "s" };

    const spy = (cepApi.fetchAddressByZip as unknown as Mock).mockResolvedValue(
      address
    );

    const { result } = renderHookWithProviders(() => useCepQuery("12345-678"));

    await waitFor(() => expect(result.current.data).toEqual(address));

    // ensure the api was called with cleaned digits only
    expect(spy).toHaveBeenCalledWith("12345678");
  });

  it("does not run the query when cep is not 8 digits", () => {
    const spy = (cepApi.fetchAddressByZip as unknown as Mock).mockResolvedValue(
      {}
    );

    const { result } = renderHookWithProviders(() => useCepQuery("123"));

    // query should be disabled (cleanCep length !== 8)
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("treats empty cep as disabled (covers falsy cep branch)", () => {
    const spy = (cepApi.fetchAddressByZip as unknown as Mock).mockResolvedValue(
      {}
    );

    // pass empty string to exercise the `cep || ""` falsy branch
    const { result } = renderHookWithProviders(() => useCepQuery(""));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });

  it("honors the options.enabled flag and disables query when false", () => {
    const spy = (cepApi.fetchAddressByZip as unknown as Mock).mockResolvedValue(
      {}
    );

    const { result } = renderHookWithProviders(() =>
      useCepQuery("12345678", { enabled: false })
    );

    // query should be disabled by options
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(spy).not.toHaveBeenCalled();
  });
});
