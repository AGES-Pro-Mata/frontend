import { useQuery } from "@tanstack/react-query";

async function preloadPdf(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load PDF: ${response.status}`);
  }

  await response.blob();

  return url;
}

export function useLoadPdf(url: string) {
  return useQuery<string, Error>({
    queryKey: ["pdf", url],
    queryFn: () => preloadPdf(url),
    enabled: !!url,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 30,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });
}
