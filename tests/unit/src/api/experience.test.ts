import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/api", () => ({
  api: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));
vi.mock("@/types/experience", () => ({
  mapExperienceApiResponseToDTO: (r: unknown) => ({
    mapped: true,
    ...(r as Record<string, unknown>),
  }),
  ExperienceCategory: {
    TRAIL: "TRAIL",
    MUSEUM: "MUSEUM",
  },
}));

import { api } from "@/core/api";
import {
  type CreateExperiencePayload,
  type FilterExperiencesParams,
  type SearchExperienceParams,
  type UpdateExperiencePayload,
  createExperience,
  deleteExperience,
  getExperienceById,
  getExperiences,
  getExperiencesByFilter,
  toggleExperienceStatus,
  updateExperience,
} from "@/api/experience";

type AxiosResponse<T> = import("axios").AxiosResponse<T>;

class FormDataStub {
  static instances: FormDataStub[] = [];

  entries: Array<[string, unknown]> = [];

  constructor() {
    FormDataStub.instances.push(this);
  }

  append(key: string, value: unknown) {
    this.entries.push([key, value]);
  }

  getAll(key: string) {
    return this.entries.filter(([label]) => label === key).map(([, value]) => value);
  }
}

// small helper so mocked api returns satisfy AxiosResponse typing
function makeResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "",
    headers: {},
    config: {},
  } as AxiosResponse<T>;
}

describe("src/api/experience", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    FormDataStub.instances = [];
    vi.stubGlobal("FormData", FormDataStub as unknown as typeof FormData);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("createExperience builds multipart payload with optional fields", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValueOnce(makeResponse({ id: "x" }, 201));

    const payload: CreateExperiencePayload = {
      experienceName: "Trilha X",
      experienceDescription: "Desc",
      experienceCategory: "TRAIL" as unknown as CreateExperiencePayload["experienceCategory"],
      experienceCapacity: 12,
      experienceImage: new File(["content"], "image.png", { type: "image/png" }),
      experienceStartDate: new Date("2024-03-01T00:00:00.000Z"),
      experienceEndDate: new Date("2024-03-02T00:00:00.000Z"),
      experiencePrice: 55,
      experienceWeekDays: ["monday", "friday"],
      trailDurationMinutes: 45,
      trailDifficulty: "hard",
      trailLength: "10km",
    };

    await createExperience(payload);

    expect(postSpy).toHaveBeenCalledWith(
      "/experience",
      expect.any(FormDataStub),
      expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } })
    );

    const callFormData = (postSpy.mock.calls[0] as unknown[])[1] as FormDataStub;

    expect(callFormData.getAll("experienceName")).toEqual(["Trilha X"]);
    expect(callFormData.getAll("experienceCapacity")).toEqual(["12"]);
    expect(callFormData.getAll("experienceStartDate")).toEqual([
      (payload.experienceStartDate as Date).toISOString(),
    ]);
    expect(callFormData.getAll("experienceEndDate")).toEqual([
      (payload.experienceEndDate as Date).toISOString(),
    ]);
    expect(callFormData.getAll("experiencePrice")).toEqual(["55"]);
    expect(callFormData.getAll("experienceWeekDays")).toEqual(["monday", "friday"]);
    expect(callFormData.getAll("trailDurationMinutes")).toEqual(["45"]);
    expect(callFormData.getAll("trailDifficulty")).toEqual(["hard"]);
    expect(callFormData.getAll("trailLength")).toEqual(["10km"]);
  });

  it("createExperience skips optional fields when data is absent", async () => {
    const postSpy = vi.spyOn(api, "post").mockResolvedValueOnce(makeResponse({ id: "y" }, 201));

    const payload: CreateExperiencePayload = {
      experienceName: "Base",
      experienceDescription: "No optionals",
      experienceCategory: "TRAIL" as unknown as CreateExperiencePayload["experienceCategory"],
      experienceCapacity: 5,
      experienceImage: new File(["file"], "image.png", { type: "image/png" }),
      experienceWeekDays: [],
    };

    await createExperience(payload);

    const callFormData = (postSpy.mock.calls[0] as unknown[])[1] as FormDataStub;

    expect(callFormData.getAll("experienceStartDate")).toHaveLength(0);
    expect(callFormData.getAll("experienceEndDate")).toHaveLength(0);
    expect(callFormData.getAll("experiencePrice")).toHaveLength(0);
    expect(callFormData.getAll("experienceWeekDays")).toHaveLength(0);
    expect(callFormData.getAll("trailDurationMinutes")).toHaveLength(0);
    expect(callFormData.getAll("trailDifficulty")).toHaveLength(0);
    expect(callFormData.getAll("trailLength")).toHaveLength(0);
  });

  it("getExperiences maps api response", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce(makeResponse([{ id: "1", name: "a" }], 200));
    const res = await getExperiences({} as unknown as SearchExperienceParams);

    expect(getSpy).toHaveBeenCalledWith(expect.stringContaining("/experiences/search"), {
      params: {},
    });
    expect(Array.isArray(res)).toBe(true);
    expect(res[0]).toMatchObject({ mapped: true });
  });

  it("getExperiencesByFilter returns pagination-shaped object", async () => {
    const payload = { items: [{ id: "i" }], page: 1, limit: 10, total: 100 };

    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce(makeResponse(payload, 200));

    const res = await getExperiencesByFilter({} as unknown as FilterExperiencesParams & {
      page?: number;
      limit?: number;
    });

    expect(getSpy).toHaveBeenCalledWith("/experience/search", {
      params: { page: 0, limit: 12 },
    });
    expect(res.items.length).toBe(1);
    expect(res.total).toBe(100);
  });

  it("getExperienceById maps response payload", async () => {
    const getSpy = vi.spyOn(api, "get").mockResolvedValueOnce(makeResponse({ id: "exp" }, 200));

    const res = await getExperienceById("exp");

    expect(getSpy).toHaveBeenCalledWith("/experience/exp");
    expect(res).toMatchObject({ id: "exp", mapped: true });
  });

  it("updateExperience serializes payloads and handles file uploads", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValueOnce(makeResponse({ success: true }));

    const payload: UpdateExperiencePayload = {
      experienceName: "Updated",
      experienceDescription: "Desc",
      experienceCategory: "TRAIL" as unknown as UpdateExperiencePayload["experienceCategory"],
      experienceCapacity: "12",
      experienceImage: new File(["new"], "new.png", { type: "image/png" }),
      experienceStartDate: new Date("2024-04-01T00:00:00.000Z"),
      experienceEndDate: "2024-05-01T00:00:00.000Z",
      experiencePrice: "100",
      experienceWeekDays: ["monday"],
      trailDurationMinutes: "90",
      trailDifficulty: "medium",
      trailLength: "5km",
    };

    await updateExperience("exp-1", payload);

    expect(patchSpy).toHaveBeenCalledWith(
      "/experience/exp-1",
      expect.any(FormDataStub),
      expect.objectContaining({ headers: { "Content-Type": "multipart/form-data" } })
    );

    const formData = (patchSpy.mock.calls[0] as unknown[])[1] as FormDataStub;

    expect(formData.getAll("image")).toHaveLength(1);
    expect(formData.getAll("experienceStartDate")).toEqual([
      (payload.experienceStartDate as Date).toISOString(),
    ]);
    expect(formData.getAll("experienceEndDate")).toEqual([payload.experienceEndDate]);
    expect(formData.getAll("experienceWeekDays")).toEqual(["monday"]);
    expect(formData.getAll("trailDurationMinutes")).toEqual(["90"]);
    expect(formData.getAll("trailDifficulty")).toEqual(["medium"]);
    expect(formData.getAll("trailLength")).toEqual(["5km"]);
  });

  it("updateExperience keeps string dates intact and formats date objects", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValueOnce(makeResponse({ success: true }));

    const payload: UpdateExperiencePayload = {
      experienceName: "Mixed",
      experienceDescription: "Dates",
      experienceCategory: "TRAIL" as unknown as UpdateExperiencePayload["experienceCategory"],
      experienceCapacity: "20",
      experiencePrice: "200",
      experienceWeekDays: ["tuesday"],
      experienceStartDate: "2024-06-01T00:00:00.000Z",
      experienceEndDate: new Date("2024-07-01T00:00:00.000Z"),
    };

    await updateExperience("exp-strings", payload);

    const formData = (patchSpy.mock.calls[0] as unknown[])[1] as FormDataStub;

    expect(formData.getAll("experienceStartDate")).toEqual(["2024-06-01T00:00:00.000Z"]);
    expect(formData.getAll("experienceEndDate")).toEqual([
      (payload.experienceEndDate as Date).toISOString(),
    ]);
  });

  it("updateExperience omits optional fields when not provided", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValueOnce(makeResponse({ success: true }));

    const payload: UpdateExperiencePayload = {
      experienceName: "Keep",
      experienceDescription: "Minimal",
      experienceCategory: "TRAIL" as unknown as UpdateExperiencePayload["experienceCategory"],
      experienceCapacity: "8",
      experienceImage: "existing.png",
      experiencePrice: "45",
      experienceWeekDays: [],
    };

    await updateExperience("exp-2", payload);

    const formData = (patchSpy.mock.calls[0] as unknown[])[1] as FormDataStub;

    expect(formData.getAll("image")).toHaveLength(0);
    expect(formData.getAll("experienceStartDate")).toHaveLength(0);
    expect(formData.getAll("experienceEndDate")).toHaveLength(0);
    expect(formData.getAll("experienceWeekDays")).toHaveLength(0);
    expect(formData.getAll("trailDurationMinutes")).toHaveLength(0);
    expect(formData.getAll("trailDifficulty")).toHaveLength(0);
    expect(formData.getAll("trailLength")).toHaveLength(0);
  });

  it("deleteExperience proxies call to api.delete", async () => {
    const deleteSpy = vi.spyOn(api, "delete").mockResolvedValueOnce(makeResponse({}, 200));

    await deleteExperience("exp-3");

    expect(deleteSpy).toHaveBeenCalledWith("/experience/exp-3");
  });

  it("toggleExperienceStatus calls patch with status flag", async () => {
    const patchSpy = vi.spyOn(api, "patch").mockResolvedValueOnce(makeResponse({}, 200));

    await toggleExperienceStatus("exp-4", true);

    expect(patchSpy).toHaveBeenCalledWith("/experience/exp-4/status/true");
  });
});
