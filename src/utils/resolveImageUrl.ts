const DEFAULT_IMAGE_SRC = "/logo-pro-mata.png";

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value) || value.startsWith("data:");

const normalizeRelativePath = (value: string) => {
  const trimmed = value.replace(/^\.\//, "").trim();

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  if (!trimmed) {
    return DEFAULT_IMAGE_SRC;
  }

  return `/${trimmed}`;
};

export const resolveImageUrl = (raw?: string | null): string => {
  if (!raw) {
    return DEFAULT_IMAGE_SRC;
  }

  const candidate = raw.trim();

  if (!candidate) {
    return DEFAULT_IMAGE_SRC;
  }

  if (isAbsoluteUrl(candidate)) {
    return candidate;
  }

  return normalizeRelativePath(candidate);
};
