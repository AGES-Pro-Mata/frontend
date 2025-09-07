import { cn } from "@/lib/utils";

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

type TypographyProps = React.ComponentPropsWithoutRef<"p"> & {
  variant?: Variant;
};

export function Typography({
  className,
  variant = "body",
  ...props
}: TypographyProps) {
  return (
    <p
      className={cn(
        `text-base leading-6 text-${variant.includes("light") ? "white" : "muted-foreground"}`,
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
