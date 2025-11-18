import { useQuery } from "@tanstack/react-query";
import { fetchAddressByZip } from "@/api/cep";
import { digitsOnly } from "@/lib/utils";

interface UseCepQueryOptions {
  enabled?: boolean;
}

export function useCepQuery(cep: string, options: UseCepQueryOptions = {}) {
  const { enabled = true } = options;
  const cleanCep = digitsOnly(cep || "");

  return useQuery({
    queryKey: ["cep", cleanCep],
    queryFn: () => fetchAddressByZip(cleanCep),
    enabled: enabled && cleanCep.length === 8,
    staleTime: 5 * 60 * 1000, // 5 minutos - CEP não muda frequentemente
    gcTime: 10 * 60 * 1000, // 10 minutos no cache
    retry: 2,
    retryDelay: 1000,
  });
}
