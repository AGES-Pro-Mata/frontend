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
