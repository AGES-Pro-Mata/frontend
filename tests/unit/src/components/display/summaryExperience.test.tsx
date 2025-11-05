import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryExperience } from "@/components/display/summaryExperience";
import { renderWithProviders } from "@/test/test-utils";

describe("SummaryExperience", () => {
  it("renders formatted experience information", () => {
    renderWithProviders(
      <SummaryExperience
        experience="Workshop de Robótica"
        startDate="2025-01-01"
        endDate="2025-01-05"
        price={199.9}
        capacity={20}
        locale="pt-BR"
        imageUrl="/workshop.png"
      />
    );

    expect(screen.getByText("Workshop de Robótica")).toBeInTheDocument();
    expect(screen.getByText(/R\$\s?199,90/)).toBeInTheDocument();
    expect(screen.getByText("20 pessoas")).toBeInTheDocument();
    expect(screen.getByAltText("Workshop de Robótica")).toHaveAttribute(
      "src",
      "/workshop.png"
    );
    expect(screen.getByText(/01\/01\/2025/)).toBeInTheDocument();
  });

  it("falls back to original date string when formatting fails", () => {
    renderWithProviders(
      <SummaryExperience
        experience="Visita Técnica"
        startDate="sem-data"
        endDate="2025-01-05"
        price={0}
        capacity={10}
        locale="pt-BR"
        imageUrl="/visit.png"
      />
    );

    expect(screen.getByText("sem-data a 05/01/2025")).toBeInTheDocument();
  });
});
