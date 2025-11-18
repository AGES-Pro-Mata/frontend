import { api } from "@/core/api";

export async function sendPaymentProof(id: string, url: string) {
  return await api.post(`reservation/group/${id}/receipt`, { url });
}