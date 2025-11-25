
import { render, screen, fireEvent } from "@testing-library/react";
import { HighlightsCarousel } from "@/components/carousel/highlightsCarousel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

describe("HighlightsCarousel uncovered branches", () => {
  it("should wrap around to first image when next is clicked at end", () => {
    const highlights = [
      { id: "1", imageUrl: "/1.jpg", title: "One", category: "CATEGORY" as any, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01", description: "desc1", active: true },
      { id: "2", imageUrl: "/2.jpg", title: "Two", category: "CATEGORY" as any, order: 2, createdAt: "2024-01-02", updatedAt: "2024-01-02", description: "desc2", active: true },
    ];
    render(
      <QueryClientProvider client={queryClient}>
        <HighlightsCarousel highlights={highlights} />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Próxima imagem/i }));
    fireEvent.click(screen.getByRole("button", { name: /Próxima imagem/i }));
    expect(screen.getByText("One")).toBeInTheDocument();
    // Edge: click thumbnail button for "Two"
    fireEvent.click(screen.getByLabelText("Ver Two"));
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("should wrap around to last image when previous is clicked at start", () => {
    const highlights = [
      { id: "1", imageUrl: "/1.jpg", title: "One", category: "CATEGORY" as any, order: 1, createdAt: "2024-01-01", updatedAt: "2024-01-01", description: "desc1", active: true },
      { id: "2", imageUrl: "/2.jpg", title: "Two", category: "CATEGORY" as any, order: 2, createdAt: "2024-01-02", updatedAt: "2024-01-02", description: "desc2", active: true },
    ];
    render(
      <QueryClientProvider client={queryClient}>
        <HighlightsCarousel highlights={highlights} />
      </QueryClientProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Imagem anterior/i }));
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("should cover empty highlights branch", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <HighlightsCarousel highlights={[]} />
      </QueryClientProvider>
    );
    expect(screen.getByText(/Nenhum destaque disponível/i)).toBeInTheDocument();
  });
});
