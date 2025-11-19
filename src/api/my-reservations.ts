import { api } from "@/core/api";



export async function sendPaymentProof(reservationGroupId: string, file: File) {
  const formData = new FormData();

  formData.append("paymentReceipt", file);
  formData.append("receipt", file);
  formData.append("file", file);
  formData.append("reservationGroupId", reservationGroupId);

  const response = await api.post(
    `/reservation/group/${reservationGroupId}/request/receipt`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  
  return response.data;
}
