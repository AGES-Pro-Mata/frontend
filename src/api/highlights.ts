import { api } from "@/core/api";
import type { HighlightCategory } from "@/entities/highlights";
import type { TApiPaginationMetaResult } from "@/entities/api-pagination-response";

export type HighlightResponse = {
  id: string;
  category: HighlightCategory;
  imageUrl: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateHighlightPayload = {
  category: HighlightCategory;
  image: File;
  title: string;
  description?: string;
  order?: number;
};

export type UpdateHighlightPayload = {
  title?: string;
  description?: string;
  order?: number;
  image?: File;
};

export type GetHighlightsParams = {
  category?: HighlightCategory;
  limit?: number;
  page?: number;
};

export async function getHighlights(params?: GetHighlightsParams) {
  const queryParams = new URLSearchParams();
  
  if (params?.category) {
    queryParams.append('category', params.category);
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }

  const query = queryParams.toString();
  const response = await api.get<{
    items: HighlightResponse[];
  } & TApiPaginationMetaResult>(`/highlights${query ? `?${query}` : ''}`);
  
  return response.data;
}

export async function getHighlightById(id: string) {
  const response = await api.get<HighlightResponse>(`/highlights/${id}`);
  return response.data;
}

export async function createHighlight(payload: CreateHighlightPayload) {
  const formData = new FormData();
  
  formData.append('category', payload.category);
  formData.append('image', payload.image);
  formData.append('title', payload.title);
  
  if (payload.description) {
    formData.append('description', payload.description);
  }
  
  if (payload.order !== undefined) {
    formData.append('order', payload.order.toString());
  }

  const response = await api.post<HighlightResponse>('/highlights', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

export async function updateHighlight(id: string, payload: UpdateHighlightPayload) {
  const formData = new FormData();
  
  if (payload.title) {
    formData.append('title', payload.title);
  }
  
  if (payload.description !== undefined) {
    formData.append('description', payload.description);
  }
  
  if (payload.order !== undefined) {
    formData.append('order', payload.order.toString());
  }
  
  if (payload.image) {
    formData.append('image', payload.image);
  }

  const response = await api.put<HighlightResponse>(`/highlights/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
}

export async function deleteHighlight(id: string) {
  const response = await api.delete(`/highlights/${id}`);
  return response.data;
}

export type HighlightsGroupedResponse = {
  [key in HighlightCategory]: HighlightResponse[];
};

export async function getHighlightsByCategories() {
  const response = await api.get<HighlightsGroupedResponse>(
    "/highlights/grouped"
  );

  return response.data;
}

export async function getPublicHighlightsByCategories() {
  const response = await api.get<HighlightsGroupedResponse>(
    "/highlights/public/grouped"
  );

  return response.data;
}
