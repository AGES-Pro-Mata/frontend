import type { AxiosResponse } from "axios";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { HighlightCategory } from "@/entities/highlights";
import { api } from "@/core/api";
import * as highlightsApi from "@/api/highlights";

const {
  createHighlight,
  deleteHighlight,
  getHighlightById,
  getHighlights,
  getHighlightsByCategories,
  getPublicHighlightsByCategories,
  updateHighlight,
} = highlightsApi;

type CreateHighlightPayload = highlightsApi.CreateHighlightPayload;
type GetHighlightsParams = highlightsApi.GetHighlightsParams;
type HighlightResponse = highlightsApi.HighlightResponse;

vi.mock("@/core/api", () => {
  return {
    api: {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    },
  };
});

type ViMock = ReturnType<typeof vi.fn>;

type ApiMock = {
  get: ViMock;
  post: ViMock;
  put: ViMock;
  delete: ViMock;
};

const mockedApi = api as unknown as ApiMock;

const createAxiosResponse = <T>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {},
  config: { headers: {} } as unknown as AxiosResponse<T>["config"],
});

describe("api/highlights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds query string when fetching highlights with params", async () => {
    const params: GetHighlightsParams = {
      category: HighlightCategory.EVENTO,
      limit: 5,
      page: 2,
    };
    const responseData = {
      items: [] as HighlightResponse[],
      total: 0,
      page: 1,
      limit: 10,
    };

    mockedApi.get.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await getHighlights(params);

    expect(mockedApi.get).toHaveBeenCalledWith(
      "/highlights?category=EVENT&limit=5&page=2"
    );
    expect(result).toStrictEqual(responseData);
  });

  it("falls back to base path when fetching highlights without params", async () => {
    const responseData = {
      items: [] as HighlightResponse[],
      total: 0,
      page: 1,
      limit: 10,
    };

    mockedApi.get.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await getHighlights();

    expect(mockedApi.get).toHaveBeenCalledWith("/highlights");
    expect(result).toStrictEqual(responseData);
  });

  it("fetches a highlight by id", async () => {
    const highlight = { id: "1" } as HighlightResponse;

    mockedApi.get.mockResolvedValueOnce(createAxiosResponse(highlight));

    const result = await getHighlightById("1");

    expect(mockedApi.get).toHaveBeenCalledWith("/highlights/1");
    expect(result).toBe(highlight);
  });

  it("creates highlight with full payload", async () => {
    const payload: CreateHighlightPayload = {
      category: HighlightCategory.EVENTO,
      image: new File(["file"], "event.png", { type: "image/png" }),
      title: "Event highlight",
      description: "A highlight",
      order: 3,
    };
    const responseData = { id: "1" };

    mockedApi.post.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await createHighlight(payload);

    expect(mockedApi.post).toHaveBeenCalledWith(
      "/highlights",
      expect.any(FormData),
      expect.anything()
    );

    const formData = mockedApi.post.mock.calls[0][1] as FormData;
    const entries = Object.fromEntries(formData.entries());

    const postConfig = mockedApi.post.mock.calls[0][2] as {
      headers?: Record<string, string>;
    };

    expect(entries).toMatchObject({
      category: payload.category,
      title: payload.title,
      description: payload.description,
      order: String(payload.order),
    });
    expect(formData.get("image")).toBeInstanceOf(File);
    expect(postConfig?.headers).toMatchObject({
      "Content-Type": "multipart/form-data",
    });
    expect(result).toBe(responseData);
  });

  it("omits optional fields when updating highlight", async () => {
    const responseData = { id: "99" };

    mockedApi.put.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await updateHighlight("99", {
      title: "Updated",
      description: "Something",
      order: 4,
      image: new File(["a"], "updated.png", { type: "image/png" }),
    });

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/highlights/99",
      expect.any(FormData),
      expect.anything()
    );

    const formData = mockedApi.put.mock.calls[0][1] as FormData;
    const entries = Object.fromEntries(formData.entries());

    const putConfig = mockedApi.put.mock.calls[0][2] as {
      headers?: Record<string, string>;
    };

    expect(entries).toMatchObject({
      title: "Updated",
      description: "Something",
      order: "4",
    });
    expect(formData.get("image")).toBeInstanceOf(File);
    expect(putConfig?.headers).toMatchObject({
      "Content-Type": "multipart/form-data",
    });
    expect(result).toBe(responseData);
  });

  it("skips unset optional fields when updating highlight", async () => {
    mockedApi.put.mockResolvedValueOnce(createAxiosResponse({ id: "50" }));

    await updateHighlight("50", {});

    const formData = mockedApi.put.mock.calls[0][1] as FormData;

    expect(Array.from(formData.entries())).toHaveLength(0);
  });

  it("deletes highlight", async () => {
    const responseData = { success: true };

    mockedApi.delete.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await deleteHighlight("123");

    expect(mockedApi.delete).toHaveBeenCalledWith("/highlights/123");
    expect(result).toEqual(responseData);
  });

  it("fetches grouped highlights", async () => {
    const responseData = { LAB: [] };

    mockedApi.get.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await getHighlightsByCategories();

    expect(mockedApi.get).toHaveBeenCalledWith("/highlights/grouped");
    expect(result).toBe(responseData);
  });

  it("fetches public grouped highlights", async () => {
    const responseData = { PUBLIC: [] };

    mockedApi.get.mockResolvedValueOnce(createAxiosResponse(responseData));

    const result = await getPublicHighlightsByCategories();

    expect(mockedApi.get).toHaveBeenCalledWith("/highlights/public/grouped");
    expect(result).toBe(responseData);
  });
});
