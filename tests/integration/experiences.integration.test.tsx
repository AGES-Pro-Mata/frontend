import type { JSX } from "react";
import { screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { api } from "@/core/api";
import { renderWithRouter } from "@/test/test-utils";

type Experience = {
  id: string;
  name: string;
};

type ExperiencesResponse = {
  data: Experience[];
};

const experiencesFixture: Experience[] = [
  { id: "trail-01", name: "Trilha interpretativa" },
  { id: "fauna-01", name: "Observação de fauna" },
];

const apiGetSpy = vi.spyOn(api, "get");

const buildResponse = (
  payload: ExperiencesResponse
): AxiosResponse<ExperiencesResponse> =>
  ({
    data: payload,
    status: 200,
    statusText: "OK",
    headers: {},
    config: {
      headers: {},
    },
  }) as AxiosResponse<ExperiencesResponse>;

function ExperiencesList(): JSX.Element {
  const { data, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const response = await api.get<ExperiencesResponse>("/experiences");

      return response.data.data;
    },
  });

  if (isLoading) {
    return <span>Carregando experiências…</span>;
  }

  return (
    <ul>
      {data?.map((experience) => (
        <li key={experience.id}>{experience.name}</li>
      ))}
    </ul>
  );
}

beforeEach(() => {
  apiGetSpy.mockResolvedValue(buildResponse({ data: experiencesFixture }));
});

afterEach(() => {
  apiGetSpy.mockReset();
});

afterAll(() => {
  apiGetSpy.mockRestore();
});

describe("experiences integration", () => {
  it("renders server data fetched through TanStack Query", async () => {
    renderWithRouter(<ExperiencesList />);

    expect(
      await screen.findByText(/Trilha interpretativa/i, undefined, {
        timeout: 1000,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Observação de fauna/i)).toBeInTheDocument();
    expect(apiGetSpy).toHaveBeenCalledWith("/experiences");
  });
});
