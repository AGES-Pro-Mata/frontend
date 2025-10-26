import { AxiosHttpClient } from "./http/axios/axios.client";
const API_URL =import.meta.env.VITE_API_URL;

export const api = new AxiosHttpClient(API_URL);
