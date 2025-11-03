import { useQuery } from "@tanstack/react-query";

async function preloadImage(url: string) {
  return new Promise<string>((resolve, reject) => {
    const img = new Image();

    img.src = url;
    img.onload = () => resolve(url);
    img.onerror = reject;
  });
}

export function useLoadImage(url: string) {
  return useQuery({
    queryKey: ["image", url],
    queryFn: () => preloadImage(url),
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
