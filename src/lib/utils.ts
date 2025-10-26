import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cpf } from "cpf-cnpj-validator";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidCpf(value?: string | null): boolean {
  if (!value) return false;

  return cpf.isValid(maskCpf(value));
}

export function isValidBrazilZip(zip: string): boolean {
  return digitsOnly(zip).length === 8;
}

export async function hashPassword(password: string): Promise<string> {
  const subtle = globalThis?.crypto?.subtle;

  if (subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  const { default: SHA256 } = await import("crypto-js/sha256.js");

  return SHA256(password).toString();
}

export function isValidForeignZip(zip: string): boolean {
  return digitsOnly(zip).length >= 4;
}

export function generateRandomPassword(length = 10) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => charset[x % charset.length])
    .join("");
}

export function digitsOnly(value: string): string {
  return (value || "").replace(/\D/g, "");
}

export function maskCpf(value: string): string {
  const v = digitsOnly(value).slice(0, 11);
  const part1 = v.slice(0, 3);
  const part2 = v.slice(3, 6);
  const part3 = v.slice(6, 9);
  const part4 = v.slice(9, 11);

  if (v.length <= 3) return part1;
  if (v.length <= 6) return `${part1}.${part2}`;
  if (v.length <= 9) return `${part1}.${part2}.${part3}`;

  return `${part1}.${part2}.${part3}-${part4}`;
}

export function maskCep(value: string): string {
  const v = digitsOnly(value).slice(0, 8);
  const part1 = v.slice(0, 5);
  const part2 = v.slice(5, 8);

  if (v.length <= 5) return part1;

  return `${part1}-${part2}`;
}

export function maskPhone(value: string): string {
  const v = digitsOnly(value).slice(0, 11); // supports 10 or 11 digits

  if (v.length === 0) return "";
  if (v.length <= 2) return `(${v}`;
  const ddd = v.slice(0, 2);

  if (v.length <= 6) return `(${ddd}) ${v.slice(2)}`;
  if (v.length <= 10) return `(${ddd}) ${v.slice(2, v.length - 4)}-${v.slice(-4)}`; // 10 digits

  // 11 digits (mobile) -> 5 digit prefix
  return `(${ddd}) ${v.slice(2, 7)}-${v.slice(7)}`;
}

