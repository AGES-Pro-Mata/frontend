vi.mock("@/components/card/experienceCard", () => ({
  __esModule: true,
  CardExperience: () => <div>Mocked CardExperience</div>,
}));
vi.mock("@/components/filter/ExperienceFilter", () => ({
  __esModule: true,
  ExperienceFilter: () => <div>Mocked ExperienceFilter</div>,
}));
vi.mock("i18next", () => ({
  t: (key: string) => key,
}));



const useGetExperiencesMock = vi.fn();
vi.mock("@/hooks", () => ({
  useGetExperiences: (...args: any[]) => useGetExperiencesMock(...args),
}));
vi.mock("@/hooks/filters/filters", () => ({
  useFilters: () => ({
    filters: {
      category: "HOSTING",
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      page: 0,
      limit: 12,
    },
    setFilter: vi.fn(),
  }),
}));

import { render, screen, waitFor } from "@testing-library/react";
import { ReservePage } from "@/routes/(index)/reserve/index";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";





describe("ReservePage uncovered branches", () => {
  afterEach(() => {
    useGetExperiencesMock.mockReset();
  });


  it("should handle empty experiences and show noExperiences message", async () => {
    useGetExperiencesMock.mockReturnValue({ data: { items: [], total: 0 }, isLoading: false, isError: false });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ReservePage />
      </QueryClientProvider>
    );
    screen.debug();
    await waitFor(() => {
      expect(screen.getByText("reserveFilter.noExperiences")).toBeInTheDocument();
    });
  });


  it("should handle error state", async () => {
    useGetExperiencesMock.mockReturnValue({ data: null, isLoading: false, isError: true });
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ReservePage />
      </QueryClientProvider>
    );
    screen.debug();
    await waitFor(() => {
      expect(screen.getByText("Error loading experiences")).toBeInTheDocument();
    });
  });
});
