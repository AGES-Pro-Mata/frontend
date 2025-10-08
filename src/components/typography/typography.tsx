import { cn } from "@/lib/utils";
import type { ElementType, HTMLAttributes } from "react";

const variants = {
  h1: "text-4xl font-bold",
  h1_light: "text-4xl font-bold text-white",

  h2: "text-3xl font-bold",
  h2_light: "text-3xl font-bold text-white",

  h3: "text-2xl font-bold",
  h3_light: "text-2xl font-bold text-white",

  h4: "text-xl font-bold",
  h4_light: "text-xl font-bold text-white",

  h5: "text-lg font-bold",
  h5_light: "text-lg font-bold text-white",

  h6: "text-base font-bold",
  h6_light: "text-base font-bold text-white",

  body: "text-base",
  body_light: "text-base text-white",
} as const;

type Variant = keyof typeof variants;

const variantElements: Record<Variant, ElementType> = {
  h1: "h1",
  h1_light: "h1",
  h2: "h2",
  h2_light: "h2",
  h3: "h3",
  h3_light: "h3",
  h4: "h4",
  h4_light: "h4",
  h5: "h5",
  h5_light: "h5",
  h6: "h6",
  h6_light: "h6",
  body: "p",
  body_light: "p",
};

type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: Variant;
};

export function Typography({
  className,
  variant = "body",
  ...props
}: TypographyProps) {
  const Component = variantElements[variant] ?? "p";

  return (
    <Component
      className={cn(
        `text-base leading-6 text-${variant.includes("light") ? "white" : "muted-foreground"}`,
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
