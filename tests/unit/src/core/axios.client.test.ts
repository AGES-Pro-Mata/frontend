import { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";

type AxiosMethodMock = ReturnType<typeof vi.fn>;

type HoistedMocks = {
  axiosCreateMock: ReturnType<typeof vi.fn>;
  axiosInstanceMock: {
    get: AxiosMethodMock;
    post: AxiosMethodMock;
    put: AxiosMethodMock;
    delete: AxiosMethodMock;
    patch: AxiosMethodMock;
    defaults: { baseURL: string };
    interceptors: { request: { use: AxiosMethodMock } };
  };
  authInterceptorMock: ReturnType<typeof vi.fn>;
  methodMocks: {
    getMock: AxiosMethodMock;
    postMock: AxiosMethodMock;
    putMock: AxiosMethodMock;
    deleteMock: AxiosMethodMock;
    patchMock: AxiosMethodMock;
    requestUseMock: AxiosMethodMock;
  };
};

const hoistedMocks = vi.hoisted<HoistedMocks>(() => {
  const axiosCreateMock = vi.fn();
  const getMock = vi.fn();
  const postMock = vi.fn();
  const putMock = vi.fn();
  const deleteMock = vi.fn();
  const patchMock = vi.fn();
  const requestUseMock = vi.fn();

  const axiosInstanceMock: HoistedMocks["axiosInstanceMock"] = {
    get: getMock,
    post: postMock,
    put: putMock,
    delete: deleteMock,
    patch: patchMock,
    defaults: { baseURL: "initial" },
    interceptors: { request: { use: requestUseMock } },
  };

  const authInterceptorMock = vi.fn((config: AxiosRequestConfig) => config);

  return {
    axiosCreateMock,
    axiosInstanceMock,
    authInterceptorMock,
    methodMocks: {
      getMock,
      postMock,
      putMock,
      deleteMock,
      patchMock,
      requestUseMock,
    },
  } satisfies HoistedMocks;
});

vi.mock("axios", () => {
  const { axiosCreateMock } = hoistedMocks;

  return {
    default: { create: axiosCreateMock },
    create: axiosCreateMock,
  };
});

vi.mock("@/core/http/axios/interceptors/auth.interceptor", () => {
  const { authInterceptorMock } = hoistedMocks;

  return {
    authInterceptor: authInterceptorMock,
  };
});

const { axiosCreateMock, axiosInstanceMock, authInterceptorMock, methodMocks } =
  hoistedMocks;

import { AxiosHttpClient } from "@/core/http/axios/axios.client";

describe("AxiosHttpClient", () => {
  beforeEach(() => {
    axiosCreateMock.mockReset();
    axiosCreateMock.mockReturnValue(axiosInstanceMock);

    methodMocks.getMock.mockReset();
    methodMocks.postMock.mockReset();
    methodMocks.putMock.mockReset();
    methodMocks.deleteMock.mockReset();
    methodMocks.patchMock.mockReset();
    methodMocks.requestUseMock.mockClear();

    axiosInstanceMock.defaults.baseURL = "initial";
  });

  it("configures axios instance with defaults and auth interceptor", () => {
    const baseURL = "https://api.example.com";

    new AxiosHttpClient(baseURL);

    expect(axiosCreateMock).toHaveBeenCalledWith({
      baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    expect(methodMocks.requestUseMock).toHaveBeenCalledWith(
      authInterceptorMock
    );
  });

  it("delegates HTTP verbs to the underlying axios instance", async () => {
    const client = new AxiosHttpClient("https://api.example.com");
    const response = { data: { id: 1 } } as AxiosResponse;

    methodMocks.getMock.mockResolvedValueOnce(response);
    methodMocks.postMock.mockResolvedValueOnce(response);
    methodMocks.putMock.mockResolvedValueOnce(response);
    methodMocks.deleteMock.mockResolvedValueOnce(response);
    methodMocks.patchMock.mockResolvedValueOnce(response);

    await expect(client.get("/items", { params: { q: "test" } })).resolves.toBe(
      response
    );
    await expect(client.post("/items", { name: "New" })).resolves.toBe(
      response
    );
    await expect(client.put("/items/1", { name: "Updated" })).resolves.toBe(
      response
    );
    await expect(client.delete("/items/1")).resolves.toBe(response);
    await expect(client.patch("/items/1", { active: true })).resolves.toBe(
      response
    );

    expect(methodMocks.getMock).toHaveBeenCalledWith("/items", {
      params: { q: "test" },
    });
    expect(methodMocks.postMock).toHaveBeenCalledWith(
      "/items",
      { name: "New" },
      undefined
    );
    expect(methodMocks.putMock).toHaveBeenCalledWith(
      "/items/1",
      { name: "Updated" },
      undefined
    );
    expect(methodMocks.deleteMock).toHaveBeenCalledWith("/items/1", undefined);
    expect(methodMocks.patchMock).toHaveBeenCalledWith(
      "/items/1",
      { active: true },
      undefined
    );
  });

  it("updates base URL through setBaseURL", () => {
    const client = new AxiosHttpClient("https://api.example.com");

    client.setBaseURL("https://api.other.com");

    expect(axiosInstanceMock.defaults.baseURL).toBe("https://api.other.com");
  });
});
