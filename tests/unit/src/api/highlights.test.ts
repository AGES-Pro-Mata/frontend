import type { AxiosResponse } from "axios";
import { HighlightCategory } from "@/entities/highlights";
import { api } from "@/core/api";
import {
  type GetHighlightsParams,
  createHighlight,
  deleteHighlight,
  getHighlightById,
  getHighlights,
  getHighlightsByCategories,
  getPublicHighlightsByCategories,
  updateHighlight,
} from "@/api/highlights";

vi.mock("@/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

describe("src/api/highlights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("builds query params correctly in getHighlights", async () => {
    const response: AxiosResponse<{ items: unknown[] }> = {
      data: { items: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    };
    const getSpy = vi.spyOn(api, "get").mockResolvedValue(response);

    const params = {
      category: HighlightCategory.CARROSSEL,
      limit: 5,
      page: 2,
    } satisfies GetHighlightsParams;

    await getHighlights(params);
    expect(getSpy).toHaveBeenCalledWith("/highlights?category=CAROUSEL&limit=5&page=2");

    await getHighlights();
    expect(getSpy).toHaveBeenCalledWith("/highlights");
  });

  it("appends optional description and order when creating a highlight", async () => {
    const postResponse: AxiosResponse<{ id: string }> = {
      data: { id: "1" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    };
    const postSpy = vi.spyOn(api, "post").mockResolvedValue(postResponse);
    const file = new File(["img"], "img.png", { type: "image/png" });

    const res = await createHighlight({
      category: HighlightCategory.CARROSSEL,
      image: file,
      title: "Title",
      description: "desc",
      order: 7,
    });

    expect(res).toEqual({ id: "1" });
    const form = postSpy.mock.calls[0][1] as FormData;

    expect(form.get("description")).toBe("desc");
    expect(form.get("order")).toBe("7");
  });

  it("omits optional fields when not provided in create and updateHighlight", async () => {
    const postResponse: AxiosResponse<{ id: string }> = {
      data: { id: "2" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    };
    const putResponse: AxiosResponse<{ id: string }> = {
      data: { id: "2" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    };

    const postSpy = vi.spyOn(api, "post").mockResolvedValue(postResponse);
    const putSpy = vi.spyOn(api, "put").mockResolvedValue(putResponse);

    const file = new File(["img"], "img.png", { type: "image/png" });

    await createHighlight({
      category: HighlightCategory.CARROSSEL,
      image: file,
      title: "No optionals",
    });

    const createForm = postSpy.mock.calls[0][1] as FormData;

    expect(createForm.has("description")).toBe(false);
    expect(createForm.has("order")).toBe(false);

    await updateHighlight("hid", { title: "up" });
    const updateForm = putSpy.mock.calls[0][1] as FormData;

    expect(updateForm.has("title")).toBe(true);
    expect(updateForm.has("description")).toBe(false);

    const image = new File(["new"], "new.png", { type: "image/png" });

    await updateHighlight("hid-full", { title: "full", description: "desc", order: 9, image });
    const updateFullForm = putSpy.mock.calls[1][1] as FormData;

    expect(updateFullForm.get("title")).toBe("full");
    expect(updateFullForm.get("description")).toBe("desc");
    expect(updateFullForm.get("order")).toBe("9");
    expect(updateFullForm.get("image")).toBe(image);

    await updateHighlight("hid-minimal", { description: "only-desc" });
    const updateMinimalForm = putSpy.mock.calls[2][1] as FormData;

    expect(updateMinimalForm.get("title")).toBeNull();
    expect(updateMinimalForm.get("description")).toBe("only-desc");
  });

  it("fetches by id and grouped highlights", async () => {
    const getSpy = vi.spyOn(api, "get");
    const deleteSpy = vi.spyOn(api, "delete").mockResolvedValue({
      data: { ok: true },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    } as AxiosResponse<{ ok: boolean }>);

    getSpy.mockResolvedValueOnce({
      data: { id: "hid" },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    } as AxiosResponse<{ id: string }>);

    getSpy.mockResolvedValueOnce({
      data: { CARROSSEL: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    } as AxiosResponse<Record<string, unknown[]>>);

    getSpy.mockResolvedValueOnce({
      data: { CARROSSEL: [] },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as never,
    } as AxiosResponse<Record<string, unknown[]>>);

    const byId = await getHighlightById("hid");

    expect(byId).toEqual({ id: "hid" });
    expect(getSpy).toHaveBeenCalledWith("/highlights/hid");

    await deleteHighlight("hid");

    expect(deleteSpy).toHaveBeenCalledWith("/highlights/hid");

    const grouped = await getHighlightsByCategories();

    expect(grouped).toEqual({ CARROSSEL: [] });
    expect(getSpy).toHaveBeenCalledWith("/highlights/grouped");

    const publicGrouped = await getPublicHighlightsByCategories();

    expect(publicGrouped).toEqual({ CARROSSEL: [] });
    expect(getSpy).toHaveBeenCalledWith("/highlights/public/grouped");
  });
});
