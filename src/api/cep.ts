type ViaCepResponse = {
  logradouro?: string;
  localidade?: string;
  erro?: boolean;
};

export async function fetchAddressByZip(
  zipDigits: string
): Promise<{ addressLine?: string; city?: string } | null> {
  const response = await fetch(`https://viacep.com.br/ws/${zipDigits}/json/`);
  const data: ViaCepResponse = await response.json();
  if (data?.erro) return null;
  return {
    addressLine: data.logradouro || undefined,
    city: data.localidade || undefined,
  };
}
