import { screen } from "@testing-library/react";
import { useQuery } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";

import { api } from "@/core/api";
import { renderWithRouter } from "@/test/test-utils";

type Experience = {
  id: string;
  name: string;
};

function ExperiencesList() {
  const { data, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: async () => {
      const response = await api.get<{ data: Experience[] }>("/experiences");
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

describe("experiences integration", () => {
  it("renders server data fetched through TanStack Query", async () => {
    renderWithRouter(<ExperiencesList />);

    expect(
      await screen.findByText(/Trilha interpretativa/i, undefined, {
        timeout: 1000,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Observação de fauna/i)
    ).toBeInTheDocument();
  });
});
