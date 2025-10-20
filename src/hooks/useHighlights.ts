import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type CreateHighlightPayload,
  type GetHighlightsParams,
  type UpdateHighlightPayload,
  createHighlight,
  deleteHighlight,
  getHighlightById,
  getHighlights,
  getHighlightsByCategories,
  getPublicHighlightsByCategories,
  updateHighlight,
} from "@/api/highlights";
import type { HighlightCategory } from "@/entities/highlights";

export const HIGHLIGHTS_QUERY_KEY = "highlights";

export function useFetchHighlights(params?: GetHighlightsParams) {
  return useQuery({
    queryKey: [HIGHLIGHTS_QUERY_KEY, params],
    queryFn: () => getHighlights(params),
  });
}

export function useFetchHighlightById(id: string) {
  return useQuery({
    queryKey: [HIGHLIGHTS_QUERY_KEY, id],
    queryFn: () => getHighlightById(id),
    enabled: !!id,
  });
}

export function useFetchHighlightsByCategories() {
  return useQuery({
    queryKey: [HIGHLIGHTS_QUERY_KEY, "grouped"],
    queryFn: getHighlightsByCategories,
  });
}

export function useFetchPublicHighlightsByCategories() {
  return useQuery({
    queryKey: [HIGHLIGHTS_QUERY_KEY, "public", "grouped"],
    queryFn: getPublicHighlightsByCategories,
  });
}

export function useCreateHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateHighlightPayload) => createHighlight(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_QUERY_KEY] });
    },
  });
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHighlightPayload }) =>
      updateHighlight(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_QUERY_KEY] });
    },
  });
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHighlight(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HIGHLIGHTS_QUERY_KEY] });
    },
  });
}

export function useHighlightsOperations(category?: HighlightCategory) {
  const { data, isLoading, error, refetch } = useFetchHighlights(
    category ? { category } : undefined
  );

  const createMutation = useCreateHighlight();
  const updateMutation = useUpdateHighlight();
  const deleteMutation = useDeleteHighlight();

  return {
    highlights: data?.items || [],
    meta: {
      total: data?.total ?? 0,
      page: data?.page ?? 0,
      limit: data?.limit ?? 10,
    },
    isLoading,
    error,
    refetch,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
