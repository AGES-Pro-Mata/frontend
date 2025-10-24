import { useQuery } from "@tanstack/react-query";
import { getHighlights } from "@/api/highlights";
import { HighlightsCarousel } from "./highlightsCarousel";
import type { HighlightCategory } from "@/entities/highlights";

interface HighlightsCarouselDemoProps {
  category?: HighlightCategory;
  limit?: number;
}

/**
 * Demo component showing how to use HighlightsCarousel with data fetching
 * 
 * Example usage:
 * ```tsx
 * <HighlightsCarouselDemo category="experiences" limit={5} />
 * ```
 */
export function HighlightsCarouselDemo({
  category,
  limit = 10,
}: HighlightsCarouselDemoProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["highlights", category, limit],
    queryFn: () => getHighlights({ category, limit }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-muted p-8">
        <div className="text-center">
          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-main-dark-green border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando destaques...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center rounded-lg bg-destructive/10 p-8">
        <p className="text-sm text-destructive">
          Erro ao carregar destaques. Tente novamente mais tarde.
        </p>
      </div>
    );
  }

  return <HighlightsCarousel highlights={data?.items || []} />;
}
