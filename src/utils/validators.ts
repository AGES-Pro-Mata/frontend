import { cpf } from "cpf-cnpj-validator";
import { digitsOnly, maskCpf } from "./formatters";

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
