import { clsx, type ClassValue } from "clsx";
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

